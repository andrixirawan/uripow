import { NextRequest, NextResponse } from "next/server";
import { toggleAgentStatus } from "@/lib/db-utils";
import { requireAuth } from "@/modules/auth/require-auth";
import { ApiResponseType } from "@/types";

/**
 * PATCH /api/agents/[agentId]/toggle - Toggle agent status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
): Promise<NextResponse<ApiResponseType>> {
  try {
    await requireAuth(); // Ensure user is authenticated
    const { agentId } = await params;

    const updatedAgent = await toggleAgentStatus(agentId);

    return NextResponse.json({
      success: true,
      data: updatedAgent,
    });
  } catch (error) {
    console.error("Error toggling agent status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to toggle agent status" },
      { status: 500 }
    );
  }
}
