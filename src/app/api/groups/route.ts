import { NextRequest, NextResponse } from "next/server";
import { getUserGroups, createUserGroup } from "@/lib/db-utils";
import { CreateGroupSchema } from "@/schemas";
import { ApiResponseType } from "@/types";
import { z } from "zod";

/**
 * GET /api/groups - Mendapatkan groups milik user dengan pagination
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponseType>> {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const groups = await getUserGroups({
      page,
      limit,
      search,
    });

    return NextResponse.json({
      success: true,
      data: groups,
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/groups - Membuat group baru untuk user
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponseType>> {
  try {
    const body = await request.json();

    // Validasi input menggunakan Zod schema
    const validationResult = CreateGroupSchema.safeParse(body);

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

    const { name, slug, description, strategy, isActive } =
      validationResult.data;

    const group = await createUserGroup({
      name,
      slug,
      description,
      strategy,
      isActive,
    });

    return NextResponse.json(
      {
        success: true,
        data: group,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating group:", error);

    // Handle unique constraint error
    if (error instanceof Error && error.message.includes("unique")) {
      return NextResponse.json(
        { success: false, error: "Nama atau slug sudah digunakan" },
        { status: 409 }
      );
    }

    // Handle validation errors
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
      { success: false, error: "Failed to create group" },
      { status: 500 }
    );
  }
}
