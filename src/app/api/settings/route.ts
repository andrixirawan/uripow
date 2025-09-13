import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const SettingsSchema = z.object({
  strategy: z.enum(["round-robin", "random", "weighted"]),
});

export async function GET(): Promise<NextResponse> {
  try {
    let settings = await db.rotationSettings.findFirst();

    // If no settings exist, create default ones
    if (!settings) {
      settings = await db.rotationSettings.create({
        data: {
          strategy: "round-robin",
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = SettingsSchema.parse(body);

    // Delete all existing settings and create new one
    await db.rotationSettings.deleteMany({});

    const settings = await db.rotationSettings.create({
      data: validatedData,
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
