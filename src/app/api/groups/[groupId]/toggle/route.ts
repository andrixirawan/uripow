import { NextRequest, NextResponse } from "next/server";
import { toggleGroupStatus } from "@/lib/db-utils";
import { requireAuth } from "@/modules/auth/require-auth";
import { ApiResponseType } from "@/types";

/**
 * PATCH /api/groups/[groupId]/toggle - Toggle group status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
): Promise<NextResponse<ApiResponseType>> {
  try {
    await requireAuth(); // Ensure user is authenticated
    const { groupId } = await params;

    const updatedGroup = await toggleGroupStatus(groupId);

    return NextResponse.json({
      success: true,
      data: updatedGroup,
    });
  } catch (error) {
    console.error("Error toggling group status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to toggle group status" },
      { status: 500 }
    );
  }
}
