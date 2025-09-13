import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "7");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get agent stats
    const agents = await db.agent.findMany({
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

    const agentStats = agents.map(
      (agent: {
        id: string;
        name: string;
        clicks: Array<{ createdAt: Date }>;
      }) => ({
        agentId: agent.id,
        agentName: agent.name,
        totalClicks: agent.clicks.length,
        lastClick:
          agent.clicks.length > 0
            ? agent.clicks[0].createdAt.toISOString()
            : null,
      })
    );

    // Get time-based stats (daily)
    const timeStats: Array<{ date: string; clicks: number }> = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      const clickCount = await db.click.count({
        where: {
          createdAt: {
            gte: date,
            lt: endDate,
          },
        },
      });

      timeStats.unshift({
        date: date.toISOString(),
        clicks: clickCount,
      });
    }

    // Get hourly stats for the last 24 hours
    const hourlyStats: Array<{ hour: number; clicks: number }> = [];
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    for (let hour = 0; hour < 24; hour++) {
      const hourStart = new Date(yesterday);
      hourStart.setHours(hour, 0, 0, 0);

      const hourEnd = new Date(hourStart);
      hourEnd.setHours(hour + 1, 0, 0, 0);

      const clickCount = await db.click.count({
        where: {
          createdAt: {
            gte: hourStart,
            lt: hourEnd,
          },
        },
      });

      hourlyStats.push({
        hour,
        clicks: clickCount,
      });
    }

    // Calculate additional metrics
    const totalClicks = await db.click.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const clicksToday = await db.click.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

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

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
