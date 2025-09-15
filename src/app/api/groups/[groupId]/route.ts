import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/modules/auth/require-auth";
import { toggleGroupStatus } from "@/lib/db-utils";
import { UpdateGroupSchema } from "@/schemas";
import { ApiResponseType } from "@/types";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
): Promise<NextResponse<ApiResponseType>> {
  try {
    const session = await requireAuth();
    const { groupId } = await params;
    const body = await request.json();

    // Validate with UpdateGroupSchema
    const validationResult = UpdateGroupSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: "Invalid input data" },
        { status: 400 }
      );
    }

    const { name, description, strategy, isActive, selectedAgents } =
      validationResult.data;

    // Verify that the group belongs to the user
    const existingGroup = await db.group.findFirst({
      where: {
        id: groupId,
        userId: session.user.id,
      },
    });

    if (!existingGroup) {
      return NextResponse.json(
        { success: false, error: "Group not found or access denied" },
        { status: 404 }
      );
    }

    const updateData: {
      name?: string;
      slug?: string;
      description?: string | null;
      strategy?: string;
      isActive?: boolean;
    } = {};

    if (name !== undefined) {
      updateData.name = name;
      updateData.slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
    if (description !== undefined) updateData.description = description || null;
    if (strategy !== undefined) updateData.strategy = strategy;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Update agents if selectedAgents is provided
    if (selectedAgents !== undefined) {
      // Remove all existing agent relationships
      await db.agentGroup.deleteMany({
        where: { groupId },
      });

      // Add new agent relationships if any
      if (selectedAgents.length > 0) {
        // Validate that all agents belong to the user
        const agents = await db.agent.findMany({
          where: {
            id: { in: selectedAgents },
            userId: session.user.id,
          },
        });

        if (agents.length !== selectedAgents.length) {
          return NextResponse.json(
            {
              success: false,
              error: "One or more agents do not belong to you",
            },
            { status: 400 }
          );
        }

        // Create new relationships
        await db.agentGroup.createMany({
          data: selectedAgents.map((agentId) => ({
            agentId,
            groupId,
            isActive: true,
          })),
        });
      }
    }

    const group = await db.group.update({
      where: { id: groupId },
      data: updateData,
      include: {
        agentGroups: {
          include: {
            agent: true,
          },
        },
        _count: {
          select: {
            clicks: true,
            agentGroups: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: group,
    });
  } catch (error) {
    console.error("Error updating group:", error);
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { success: false, error: "Group name or slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update group" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
): Promise<NextResponse<ApiResponseType>> {
  try {
    const { groupId } = await params;
    const group = await toggleGroupStatus(groupId);

    return NextResponse.json({
      success: true,
      data: group,
    });
  } catch (error) {
    console.error("Error toggling group status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to toggle group status" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
): Promise<NextResponse<ApiResponseType>> {
  try {
    const session = await requireAuth();
    const { groupId } = await params;

    // Verify that the group belongs to the user
    const existingGroup = await db.group.findFirst({
      where: {
        id: groupId,
        userId: session.user.id,
      },
    });

    if (!existingGroup) {
      return NextResponse.json(
        { success: false, error: "Group not found or access denied" },
        { status: 404 }
      );
    }

    await db.group.delete({
      where: { id: groupId },
    });

    return NextResponse.json({
      success: true,
      data: { message: "Group deleted successfully" },
    });
  } catch (error) {
    console.error("Error deleting group:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete group" },
      { status: 500 }
    );
  }
}
