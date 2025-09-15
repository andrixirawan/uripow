import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/modules/auth/require-auth";
import { toggleGroupStatus } from "@/lib/db-utils";
import { ApiResponseType } from "@/types";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
): Promise<NextResponse<ApiResponseType>> {
  try {
    const session = await requireAuth();
    const { name, description, strategy, isActive } = await request.json();
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
