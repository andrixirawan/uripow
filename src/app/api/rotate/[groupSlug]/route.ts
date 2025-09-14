import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

interface AgentGroupWithAgent {
  id: string;
  agentId: string;
  groupId: string;
  weight: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  agent: {
    id: string;
    name: string;
    phoneNumber: string;
    isActive: boolean;
    weight: number;
    createdAt: Date;
    updatedAt: Date;
  };
}

interface GroupWithAgentGroups {
  id: string;
  name: string;
  slug: string;
  strategy: string;
  agentGroups: AgentGroupWithAgent[];
}

async function getNextAgentFromGroup(groupSlug: string): Promise<{
  phoneNumber: string | null;
  group: GroupWithAgentGroups | null;
  agent: AgentGroupWithAgent["agent"] | null;
}> {
  try {
    // Find the group by slug using findFirst since we don't have userId
    const group = await db.group.findFirst({
      where: {
        slug: groupSlug,
        isActive: true,
      },
      include: {
        agentGroups: {
          where: {
            isActive: true,
            agent: {
              isActive: true,
            },
          },
          include: {
            agent: true,
          },
        },
      },
    });

    if (!group || group.agentGroups.length === 0) {
      return { phoneNumber: null, group: null, agent: null };
    }

    const activeAgentGroups = group.agentGroups;
    let selectedAgentGroup;

    switch (group.strategy) {
      case "random":
        selectedAgentGroup =
          activeAgentGroups[
            Math.floor(Math.random() * activeAgentGroups.length)
          ];
        break;

      case "weighted":
        // Create a weighted array based on agent group weights
        const weightedAgentGroups: AgentGroupWithAgent[] = [];
        activeAgentGroups.forEach((agentGroup: AgentGroupWithAgent) => {
          for (let i = 0; i < agentGroup.weight; i++) {
            weightedAgentGroups.push(agentGroup);
          }
        });
        const randomIndex = Math.floor(
          Math.random() * weightedAgentGroups.length
        );
        selectedAgentGroup = weightedAgentGroups[randomIndex];
        break;

      case "round-robin":
      default:
        // Get click counts for each agent in this group in the last 24 hours
        const clickCounts = await db.click.groupBy({
          by: ["agentId"],
          where: {
            groupId: group.id,
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
          },
          _count: {
            agentId: true,
          },
        });

        // Find agent with least clicks in this group
        const agentClickMap = new Map(
          clickCounts.map(
            (cc: { agentId: string; _count: { agentId: number } }) => [
              cc.agentId,
              cc._count.agentId,
            ]
          )
        );
        selectedAgentGroup = activeAgentGroups.reduce(
          (leastUsed: AgentGroupWithAgent, current: AgentGroupWithAgent) => {
            const currentCount = agentClickMap.get(current.agentId) || 0;
            const leastUsedCount = agentClickMap.get(leastUsed.agentId) || 0;
            return currentCount < leastUsedCount ? current : leastUsed;
          }
        );
        break;
    }

    return {
      phoneNumber: selectedAgentGroup?.agent.phoneNumber || null,
      group,
      agent: selectedAgentGroup?.agent || null,
    };
  } catch (error) {
    console.error("Error getting next agent from group:", error);
    return { phoneNumber: null, group: null, agent: null };
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ groupSlug: string }> }
) {
  try {
    const { groupSlug } = await params;

    const { phoneNumber, group, agent } = await getNextAgentFromGroup(
      groupSlug
    );

    if (!phoneNumber || !group || !agent) {
      return NextResponse.json(
        {
          error: `No active agents available in group "${groupSlug}"`,
        },
        { status: 404 }
      );
    }

    // Log the click for analytics
    const userAgent = request.headers.get("user-agent") || "";
    const forwarded = request.headers.get("x-forwarded-for");
    const ipAddress =
      forwarded?.split(",")[0] || request.headers.get("x-real-ip") || "";
    const referrer = request.headers.get("referer") || "";

    // Check for recent clicks from same IP to prevent duplicates
    const recentClick = await db.click.findFirst({
      where: {
        ipAddress,
        groupId: group.id,
        createdAt: {
          gte: new Date(Date.now() - 5000), // 5 seconds ago
        },
      },
    });

    // Only create click if no recent click from same IP
    if (!recentClick) {
      await db.click.create({
        data: {
          agentId: agent.id,
          groupId: group.id,
          userAgent,
          ipAddress,
          referrer,
        },
      });
    }

    // Redirect to WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}`;
    return NextResponse.redirect(whatsappUrl);
  } catch (error) {
    console.error("Error in group rotation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
