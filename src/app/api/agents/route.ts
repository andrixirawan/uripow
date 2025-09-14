import { NextRequest, NextResponse } from "next/server";
import { getUserAgents, createUserAgent } from "@/lib/db-utils";
import { CreateAgentSchema } from "@/schemas";
import { ApiResponseType } from "@/types";

/**
 * GET /api/agents - Mendapatkan semua agent milik user
 */
export async function GET(): Promise<NextResponse<ApiResponseType>> {
  try {
    const agents = await getUserAgents();

    return NextResponse.json({
      success: true,
      data: agents,
    });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/agents - Membuat agent baru untuk user
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponseType>> {
  try {
    const body = await request.json();

    // Validasi input menggunakan Zod schema
    const validationResult = CreateAgentSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      console.log("Validation errors:", errors);
      console.log("Request body:", body);

      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: errors,
        },
        { status: 400 }
      );
    }

    const { name, phoneNumber, weight } = validationResult.data;

    const agent = await createUserAgent({
      name,
      phoneNumber,
      weight,
    });

    return NextResponse.json(
      {
        success: true,
        data: agent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating agent:", error);

    // Handle unique constraint error
    if (error instanceof Error && error.message.includes("unique")) {
      return NextResponse.json(
        { success: false, error: "Nomor telepon sudah digunakan" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create agent" },
      { status: 500 }
    );
  }
}
