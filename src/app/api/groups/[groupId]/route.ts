import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { name, description, strategy, isActive } = await request.json();
    const { groupId } = await params;

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

    return NextResponse.json(group);
  } catch (error) {
    console.error("Error updating group:", error);
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Group name or slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update group" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId } = await params;

    await db.group.delete({
      where: { id: groupId },
    });

    return NextResponse.json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error("Error deleting group:", error);
    return NextResponse.json(
      { error: "Failed to delete group" },
      { status: 500 }
    );
  }
}
