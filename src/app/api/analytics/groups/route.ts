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
    const groupId = searchParams.get("group");
    const days = parseInt(searchParams.get("days") || "7");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const whereClause: {
      createdAt: { gte: Date };
      groupId?: string;
      agent: { userId: string };
    } = {
      createdAt: {
        gte: startDate,
      },
      agent: {
        userId: session.user.id, // Only user's agents
      },
    };

    if (groupId && groupId !== "all") {
      whereClause.groupId = groupId;
    }

    // Get click data grouped by agent and group
    const clickData = await db.click.findMany({
      where: whereClause,
      include: {
        agent: true,
        group: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Get group statistics - only user's groups
    const groupStats = await db.group.findMany({
      where: {
        userId: session.user.id, // Only user's groups
      },
      include: {
        _count: {
          select: {
            clicks: {
              where: {
                createdAt: {
                  gte: startDate,
                },
              },
            },
            agentGroups: {
              where: {
                isActive: true,
              },
            },
          },
        },
        agentGroups: {
          where: {
            isActive: true,
          },
          include: {
            agent: true,
          },
        },
      },
    });

    // Process data for charts
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      clicks: 0,
    }));
    const dailyData = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return { date: date.toISOString().split("T")[0], clicks: 0 };
    });

    interface ClickData {
      createdAt: Date;
      agent: { name: string };
      group: { name: string } | null;
    }

    const agentClickMap = new Map<string, number>();
    const groupClickMap = new Map<string, number>();

    clickData.forEach((click: ClickData) => {
      // Hourly data
      const hour = new Date(click.createdAt).getHours();
      hourlyData[hour].clicks++;

      // Daily data
      const date = new Date(click.createdAt).toISOString().split("T")[0];
      const dayData = dailyData.find((d) => d.date === date);
      if (dayData) dayData.clicks++;

      // Agent clicks
      const agentName = click.agent.name;
      agentClickMap.set(agentName, (agentClickMap.get(agentName) || 0) + 1);

      // Group clicks
      if (click.group) {
        const groupName = click.group.name;
        groupClickMap.set(groupName, (groupClickMap.get(groupName) || 0) + 1);
      }
    });

    const agentDistribution = Array.from(agentClickMap.entries()).map(
      ([name, clicks]) => ({
        name,
        clicks,
      })
    );

    const groupDistribution = Array.from(groupClickMap.entries()).map(
      ([name, clicks]) => ({
        name,
        clicks,
      })
    );

    interface GroupStatsData {
      id: string;
      name: string;
      slug: string;
      isActive: boolean;
      strategy: string;
      _count: { clicks: number; agentGroups: number };
    }

    return NextResponse.json({
      success: true,
      data: {
        totalClicks: clickData.length,
        hourlyData,
        dailyData,
        agentDistribution,
        groupDistribution,
        groupStats: groupStats.map((group: GroupStatsData) => ({
          id: group.id,
          name: group.name,
          slug: group.slug,
          isActive: group.isActive,
          strategy: group.strategy,
          clickCount: group._count.clicks,
          agentCount: group._count.agentGroups,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching group analytics:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
