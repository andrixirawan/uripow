import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const CreateAgentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+\d+$/, "Phone number must start with + and contain only digits"),
  weight: z.number().min(1).max(10).default(1),
  isActive: z.boolean().default(true),
});

export async function GET(): Promise<NextResponse> {
  try {
    const agents = await db.agent.findMany({
      include: {
        _count: {
          select: {
            clicks: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(agents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = CreateAgentSchema.parse(body);

    // Check if phone number already exists
    const existingAgent = await db.agent.findUnique({
      where: {
        phoneNumber: validatedData.phoneNumber,
      },
    });

    if (existingAgent) {
      return NextResponse.json(
        { error: "Phone number already exists" },
        { status: 400 }
      );
    }

    const agent = await db.agent.create({
      data: validatedData,
    });

    return NextResponse.json(agent, { status: 201 });
  } catch (error) {
    console.error("Error creating agent:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create agent" },
      { status: 500 }
    );
  }
}
