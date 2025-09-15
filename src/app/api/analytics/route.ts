import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/modules/auth/require-auth";
import { ApiResponseType } from "@/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponseType>> {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "7");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get agent stats with optimized query (avoid N+1)
    const agents = await db.agent.findMany({
      where: {
        userId: session.user.id, // Only user's agents
      },
      include: {
        clicks: {
          where: {
            createdAt: {
              gte: startDate,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    interface AgentWithClicks {
      id: string;
      name: string;
      clicks: Array<{ createdAt: Date }>;
    }

    const agentStats = agents.map((agent: AgentWithClicks) => ({
      agentId: agent.id,
      agentName: agent.name,
      totalClicks: agent.clicks.length,
      lastClick:
        agent.clicks.length > 0
          ? agent.clicks[0].createdAt.toISOString()
          : null,
    }));

    // Get time-based stats (daily) - optimized with single query
    const timeStats: Array<{ date: string; clicks: number }> = [];

    // Get all clicks for the period in one query
    const allClicks = await db.click.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
        agent: {
          userId: session.user.id, // Only user's agents
        },
      },
      select: {
        createdAt: true,
      },
    });

    // Group clicks by date
    const clicksByDate = new Map<string, number>();
    allClicks.forEach((click) => {
      const date = click.createdAt.toISOString().split("T")[0];
      clicksByDate.set(date, (clicksByDate.get(date) || 0) + 1);
    });

    // Generate time stats for the requested period
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toISOString().split("T")[0];

      timeStats.unshift({
        date: date.toISOString(),
        clicks: clicksByDate.get(dateStr) || 0,
      });
    }

    // Get hourly stats for the last 24 hours - optimized
    const hourlyStats: Array<{ hour: number; clicks: number }> = [];
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    // Get all clicks for the last 24 hours in one query
    const last24HoursClicks = await db.click.findMany({
      where: {
        createdAt: {
          gte: yesterday,
        },
        agent: {
          userId: session.user.id, // Only user's agents
        },
      },
      select: {
        createdAt: true,
      },
    });

    // Group clicks by hour
    const clicksByHour = new Map<number, number>();
    last24HoursClicks.forEach((click) => {
      const hour = click.createdAt.getHours();
      clicksByHour.set(hour, (clicksByHour.get(hour) || 0) + 1);
    });

    // Generate hourly stats
    for (let hour = 0; hour < 24; hour++) {
      hourlyStats.push({
        hour,
        clicks: clicksByHour.get(hour) || 0,
      });
    }

    // Calculate additional metrics - optimized
    const totalClicks = allClicks.length; // Use already fetched data

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const clicksToday = allClicks.filter(
      (click) => click.createdAt >= today && click.createdAt < tomorrow
    ).length;

    const avgClicksPerDay = days > 0 ? totalClicks / days : 0;

    // Find peak hour
    const peakHour = hourlyStats.reduce((peak, current) =>
      current.clicks > peak.clicks ? current : peak
    ).hour;

    const analytics = {
      agentStats,
      timeStats,
      hourlyStats,
      totalClicks,
      clicksToday,
      avgClicksPerDay,
      peakHour,
    };

    return NextResponse.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
