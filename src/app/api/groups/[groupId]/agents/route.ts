import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId } = await params;

    // Get all agents in this group
    const agentGroups = await db.agentGroup.findMany({
      where: { groupId },
      include: {
        agent: true,
      },
    });

    // Get all available agents not in this group
    const agentsInGroup = agentGroups.map((ag) => ag.agentId);
    const availableAgents = await db.agent.findMany({
      where: {
        id: {
          notIn: agentsInGroup,
        },
      },
    });

    return NextResponse.json({
      groupAgents: agentGroups.map(
        (ag: {
          id: string;
          agentId: string;
          agent: { name: string; phoneNumber: string };
          weight: number;
          isActive: boolean;
        }) => ({
          id: ag.id,
          agentId: ag.agentId,
          name: ag.agent.name,
          phoneNumber: ag.agent.phoneNumber,
          weight: ag.weight,
          isActive: ag.isActive,
        })
      ),
      availableAgents: availableAgents.map(
        (agent: { id: string; name: string; phoneNumber: string }) => ({
          id: agent.id,
          name: agent.name,
          phoneNumber: agent.phoneNumber,
        })
      ),
    });
  } catch (error) {
    console.error("Error fetching group agents:", error);
    return NextResponse.json(
      { error: "Failed to fetch group agents" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { agentId, weight = 1, isActive = true } = await request.json();
    const { groupId } = await params;

    if (!agentId) {
      return NextResponse.json(
        { error: "Agent ID is required" },
        { status: 400 }
      );
    }

    // Check if agent is already in group
    const existingAgentGroup = await db.agentGroup.findUnique({
      where: {
        agentId_groupId: {
          agentId,
          groupId,
        },
      },
    });

    if (existingAgentGroup) {
      return NextResponse.json(
        { error: "Agent is already in this group" },
        { status: 400 }
      );
    }

    const agentGroup = await db.agentGroup.create({
      data: {
        agentId,
        groupId,
        weight,
        isActive,
      },
      include: {
        agent: true,
      },
    });

    return NextResponse.json({
      id: agentGroup.id,
      agentId: agentGroup.agentId,
      name: agentGroup.agent.name,
      phoneNumber: agentGroup.agent.phoneNumber,
      weight: agentGroup.weight,
      isActive: agentGroup.isActive,
    });
  } catch (error) {
    console.error("Error adding agent to group:", error);
    return NextResponse.json(
      { error: "Failed to add agent to group" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { agentId } = await request.json();
    const { groupId } = await params;

    if (!agentId) {
      return NextResponse.json(
        { error: "Agent ID is required" },
        { status: 400 }
      );
    }

    await db.agentGroup.delete({
      where: {
        agentId_groupId: {
          agentId,
          groupId,
        },
      },
    });

    return NextResponse.json({
      message: "Agent removed from group successfully",
    });
  } catch (error) {
    console.error("Error removing agent from group:", error);
    return NextResponse.json(
      { error: "Failed to remove agent from group" },
      { status: 500 }
    );
  }
}
