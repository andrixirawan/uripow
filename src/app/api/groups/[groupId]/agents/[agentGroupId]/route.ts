import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string; agentGroupId: string }> }
) {
  try {
    const { weight, isActive } = await request.json();
    const { agentGroupId } = await params;

    const updateData: {
      weight?: number;
      isActive?: boolean;
    } = {};

    if (weight !== undefined) updateData.weight = weight;
    if (isActive !== undefined) updateData.isActive = isActive;

    const agentGroup = await db.agentGroup.update({
      where: { id: agentGroupId },
      data: updateData,
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
    console.error("Error updating agent in group:", error);
    return NextResponse.json(
      { error: "Failed to update agent in group" },
      { status: 500 }
    );
  }
}
