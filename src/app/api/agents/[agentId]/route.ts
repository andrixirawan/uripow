import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { toggleAgentStatus } from "@/lib/db-utils";
import { z } from "zod";
import { ApiResponseType } from "@/types";

const UpdateAgentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+\d+$/, "Phone number must start with + and contain only digits"),
  weight: z.number().min(1).max(10),
  isActive: z.boolean(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
): Promise<NextResponse> {
  try {
    const { agentId } = await params;
    const body = await request.json();
    const validatedData = UpdateAgentSchema.parse(body);

    // Check if phone number already exists (excluding current agent)
    const existingAgent = await db.agent.findFirst({
      where: {
        phoneNumber: validatedData.phoneNumber,
        NOT: {
          id: agentId,
        },
      },
    });

    if (existingAgent) {
      return NextResponse.json(
        { error: "Phone number already exists" },
        { status: 400 }
      );
    }

    const agent = await db.agent.update({
      where: { id: agentId },
      data: validatedData,
    });

    return NextResponse.json(agent);
  } catch (error) {
    console.error("Error updating agent:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update agent" },
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
