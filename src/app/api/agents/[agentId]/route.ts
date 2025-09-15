import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { toggleAgentStatus } from "@/lib/db-utils";
import { requireAuth } from "@/modules/auth/require-auth";
import { UpdateAgentSchema } from "@/schemas";
import { z } from "zod";
import { ApiResponseType } from "@/types";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
): Promise<NextResponse> {
  try {
    const session = await requireAuth();
    const { agentId } = await params;
    const body = await request.json();
    const validatedData = UpdateAgentSchema.parse(body);

    // Verify that the agent belongs to the current user
    const existingAgent = await db.agent.findFirst({
      where: {
        id: agentId,
        userId: session.user.id,
      },
    });

    if (!existingAgent) {
      return NextResponse.json(
        {
          success: false,
          error: "Agent not found or access denied",
        },
        { status: 404 }
      );
    }

    // Check if phone number already exists (only if phoneNumber is being updated)
    // Only check within the current user's agents
    if (validatedData.phoneNumber !== undefined) {
      const duplicateAgent = await db.agent.findFirst({
        where: {
          phoneNumber: validatedData.phoneNumber,
          userId: session.user.id, // Only check within current user's agents
          NOT: {
            id: agentId,
          },
        },
      });

      if (duplicateAgent) {
        return NextResponse.json(
          {
            success: false,
            error: "Phone number already exists in your agents",
          },
          { status: 400 }
        );
      }
    }

    // Only update fields that are provided
    const updateData: {
      name?: string;
      phoneNumber?: string;
      isActive?: boolean;
    } = {};
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.phoneNumber !== undefined)
      updateData.phoneNumber = validatedData.phoneNumber;
    if (validatedData.isActive !== undefined)
      updateData.isActive = validatedData.isActive;

    const agent = await db.agent.update({
      where: { id: agentId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: agent,
    });
  } catch (error) {
    console.error("Error updating agent:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.issues[0].message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update agent",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
): Promise<NextResponse<ApiResponseType>> {
  try {
    const { agentId } = await params;
    const agent = await toggleAgentStatus(agentId);

    return NextResponse.json({
      success: true,
      data: agent,
    });
  } catch (error) {
    console.error("Error toggling agent status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to toggle agent status" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
): Promise<NextResponse<ApiResponseType>> {
  try {
    const { agentId } = await params;

    // Check if agent exists
    const agent = await db.agent.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      return NextResponse.json(
        { success: false, error: "Agent not found" },
        { status: 404 }
      );
    }

    // Delete agent (clicks will be cascade deleted)
    await db.agent.delete({
      where: { id: agentId },
    });

    return NextResponse.json({
      success: true,
      data: { message: "Agent deleted successfully" },
    });
  } catch (error) {
    console.error("Error deleting agent:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete agent" },
      { status: 500 }
    );
  }
}
