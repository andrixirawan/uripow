import { NextRequest, NextResponse } from "next/server";
import {
  getUserRotationSettings,
  updateUserRotationSettings,
} from "@/lib/db-utils";
import { z } from "zod";
import { ApiResponseType } from "@/types";

const SettingsSchema = z.object({
  strategy: z.enum(["round-robin", "random", "weighted"]),
});

export async function GET(): Promise<NextResponse<ApiResponseType>> {
  try {
    const settings = await getUserRotationSettings();

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponseType>> {
  try {
    const body = await request.json();
    const validatedData = SettingsSchema.parse(body);

    const settings = await updateUserRotationSettings(validatedData.strategy);

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error updating settings:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
