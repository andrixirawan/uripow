import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/modules/auth/require-auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string; agentGroupId: string }> }
) {
  try {
    const session = await requireAuth();
    const { weight, isActive } = await request.json();
    const { agentGroupId } = await params;

    // Verify that the agentGroup belongs to the current user
    const existingAgentGroup = await db.agentGroup.findFirst({
      where: {
        id: agentGroupId,
        group: {
          userId: session.user.id,
        },
      },
    });

    if (!existingAgentGroup) {
      return NextResponse.json(
        { error: "Agent group not found or access denied" },
        { status: 404 }
      );
    }

    const updateData: {
      weight?: number;
      isActive?: boolean;
    } = {};

    if (weight !== undefined) updateData.weight = weight;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedAgentGroup = await db.agentGroup.update({
      where: { id: agentGroupId },
      data: updateData,
      include: {
        agent: true,
      },
    });

    return NextResponse.json({
      id: updatedAgentGroup.id,
      agentId: updatedAgentGroup.agentId,
      name: updatedAgentGroup.agent.name,
      phoneNumber: updatedAgentGroup.agent.phoneNumber,
      weight: updatedAgentGroup.weight,
      isActive: updatedAgentGroup.isActive,
    });
  } catch (error) {
    console.error("Error updating agent in group:", error);
    return NextResponse.json(
      { error: "Failed to update agent in group" },
      { status: 500 }
    );
  }
}
