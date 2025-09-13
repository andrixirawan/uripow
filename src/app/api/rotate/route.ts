import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get active agents
    const activeAgents = await db.agent.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (activeAgents.length === 0) {
      return NextResponse.json(
        { error: "No active agents available" },
        { status: 503 }
      );
    }

    // Get rotation settings
    let settings = await db.rotationSettings.findFirst();
    if (!settings) {
      settings = await db.rotationSettings.create({
        data: {
          strategy: "round-robin",
        },
      });
    }

    let selectedAgent;

    switch (settings.strategy) {
      case "round-robin":
        selectedAgent = await selectRoundRobinAgent(activeAgents);
        break;
      case "weighted":
        selectedAgent = selectWeightedAgent(activeAgents);
        break;
      case "random":
      default:
        selectedAgent = selectRandomAgent(activeAgents);
        break;
    }

    // Log the click
    const userAgent = request.headers.get("user-agent") || undefined;
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ipAddress = forwardedFor?.split(",")[0] || realIp || undefined;
    const referer = request.headers.get("referer") || undefined;

    await db.click.create({
      data: {
        agentId: selectedAgent.id,
        groupId: null, // This is for backward compatibility - no group specified
        userAgent,
        ipAddress,
        referrer: referer,
      },
    });

    // Generate WhatsApp URL
    const cleanNumber = selectedAgent.phoneNumber.replace(/[^\d]/g, "");
    const whatsappUrl = `https://wa.me/${cleanNumber}`;

    // Redirect to WhatsApp
    return NextResponse.redirect(whatsappUrl, 302);
  } catch (error) {
    console.error("Error in rotation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

interface Agent {
  id: string;
  name: string;
  phoneNumber: string;
  weight: number;
  createdAt: Date;
}

async function selectRoundRobinAgent(agents: Agent[]): Promise<Agent> {
  // Get the agent with the least recent click
  const agentStats = await Promise.all(
    agents.map(async (agent) => {
      const lastClick = await db.click.findFirst({
        where: { agentId: agent.id },
        orderBy: { createdAt: "desc" },
      });

      return {
        agent,
        lastClickTime: lastClick?.createdAt || new Date(0),
      };
    })
  );

  // Sort by last click time (oldest first) and then by creation time
  agentStats.sort((a, b) => {
    const timeDiff = a.lastClickTime.getTime() - b.lastClickTime.getTime();
    if (timeDiff !== 0) return timeDiff;
    return a.agent.createdAt.getTime() - b.agent.createdAt.getTime();
  });

  return agentStats[0].agent;
}

function selectWeightedAgent(agents: Agent[]): Agent {
  const totalWeight = agents.reduce((sum, agent) => sum + agent.weight, 0);
  let random = Math.random() * totalWeight;

  for (const agent of agents) {
    random -= agent.weight;
    if (random <= 0) {
      return agent;
    }
  }

  // Fallback to last agent
  return agents[agents.length - 1];
}

function selectRandomAgent(agents: Agent[]): Agent {
  const randomIndex = Math.floor(Math.random() * agents.length);
  return agents[randomIndex];
}
