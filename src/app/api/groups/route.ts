import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const groups = await db.group.findMany({
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
      orderBy: { createdAt: "desc" },
    });

    const formattedGroups = groups.map(
      (group: {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        isActive: boolean;
        strategy: string;
        createdAt: Date;
        updatedAt: Date;
        _count: { agentGroups: number; clicks: number };
        agentGroups: Array<{
          isActive: boolean;
          agent: { id: string; name: string; phoneNumber: string };
          weight: number;
        }>;
      }) => ({
        id: group.id,
        name: group.name,
        slug: group.slug,
        description: group.description,
        isActive: group.isActive,
        strategy: group.strategy,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
        agentCount: group._count.agentGroups,
        clickCount: group._count.clicks,
        agents: group.agentGroups
          .filter((ag: { isActive: boolean }) => ag.isActive)
          .map(
            (ag: {
              agent: { id: string; name: string; phoneNumber: string };
              weight: number;
              isActive: boolean;
            }) => ({
              id: ag.agent.id,
              name: ag.agent.name,
              phoneNumber: ag.agent.phoneNumber,
              weight: ag.weight,
              isActive: ag.isActive,
            })
          ),
      })
    );

    return NextResponse.json(formattedGroups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      description,
      strategy = "round-robin",
    } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Group name is required" },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const group = await db.group.create({
      data: {
        name,
        slug,
        description: description || null,
        strategy,
      },
    });

    return NextResponse.json(group);
  } catch (error) {
    console.error("Error creating group:", error);
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Group name or slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}
