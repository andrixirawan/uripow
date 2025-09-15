import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/modules/auth/require-auth";
import {
  generateRotationSequence,
  calculateSequenceStats,
  validateSequence,
  type RotationStrategy,
} from "@/lib/rotation-utils";

/**
 * Group-specific rotation endpoint with sequence generation
 * /api/rotate/[groupSlug]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ groupSlug: string }> }
): Promise<NextResponse> {
  try {
    const { groupSlug } = await params;

    // Get group with agents
    const group = await db.group.findFirst({
      where: {
        slug: groupSlug,
        isActive: true,
      },
      include: {
        agentGroups: {
          where: {
            isActive: true,
          },
          include: {
            agent: true, // Remove where clause from include
          },
        },
      },
    });

    if (!group) {
      return NextResponse.json(
        { error: "Group not found or inactive" },
        { status: 404 }
      );
    }

    if (!group.agentGroups || group.agentGroups.length === 0) {
      return NextResponse.json(
        { error: "No active agents in this group" },
        { status: 503 }
      );
    }

    // Extract active agents
    const activeAgents = group.agentGroups
      .filter((ag) => ag.agent && ag.agent.isActive)
      .map((ag) => ag.agent!);

    if (activeAgents.length === 0) {
      return NextResponse.json(
        { error: "No active agents available" },
        { status: 503 }
      );
    }

    // Check if sequence needs regeneration
    const needsRegeneration = shouldRegenerateSequence(group, activeAgents);

    let sequence = group.rotationSequence || [];
    let currentIndex = group.currentIndex || 0;

    if (needsRegeneration || sequence.length === 0) {
      // Generate new sequence
      const agentPhones = activeAgents.map((agent) => agent.phoneNumber);
      const agentWeights = group.agentGroups.map((ag) => ({
        phone: ag.agent!.phoneNumber,
        weight: ag.weight || 1,
      }));

      console.log(`Generating new sequence for strategy: ${group.strategy}`);
      console.log(`Agent Phones: ${agentPhones.join(", ")}`);
      console.log(`Agent Weights:`, agentWeights);

      sequence = generateRotationSequence(
        group.strategy as RotationStrategy,
        agentPhones,
        agentWeights,
        1000 // Generate 1000 rotations
      );

      console.log(
        `Generated sequence (first 10): ${sequence.slice(0, 10).join(", ")}`
      );

      // Validate sequence
      const validation = validateSequence(sequence, agentPhones);
      if (!validation.isValid) {
        console.error("Sequence validation failed:", validation.issues);
        // Fallback to simple round-robin
        sequence = generateRotationSequence(
          "round-robin",
          agentPhones,
          undefined,
          1000
        );
      }

      // Update group with new sequence
      await db.group.update({
        where: { id: group.id },
        data: {
          rotationSequence: sequence,
          currentIndex: 0,
          sequenceVersion: (group.sequenceVersion || 1) + 1,
          lastSequenceUpdate: new Date(),
        },
      });

      currentIndex = 0;
    }

    // Get current phone number from sequence
    const phoneNumber = sequence[currentIndex % sequence.length];

    // Debug logging
    console.log(`Rotation Debug - Group: ${group.name}`);
    console.log(
      `Current Index: ${currentIndex}, Sequence Length: ${sequence.length}`
    );
    console.log(`Selected Phone: ${phoneNumber}`);
    console.log(
      `Available Agents: ${activeAgents.map((a) => a.phoneNumber).join(", ")}`
    );

    // Find the agent for this phone number
    const selectedAgent = activeAgents.find(
      (agent) => agent.phoneNumber === phoneNumber
    );
    if (!selectedAgent) {
      console.error(`Selected agent not found for phone: ${phoneNumber}`);
      return NextResponse.json(
        { error: "Selected agent not found" },
        { status: 500 }
      );
    }

    // Increment index for next request
    const nextIndex = (currentIndex + 1) % sequence.length;

    // Update current index immediately for proper rotation
    await db.group.update({
      where: { id: group.id },
      data: {
        currentIndex: nextIndex,
        lastSequenceUpdate: new Date(), // Update timestamp
      },
    });

    // Log the click (async, don't block response)
    logClickAsync(group.id, selectedAgent.id, request);

    // Generate WhatsApp URL
    const cleanNumber = phoneNumber.replace(/[^\d]/g, "");
    const whatsappUrl = `https://wa.me/${cleanNumber}`;

    // Redirect to WhatsApp
    return NextResponse.redirect(whatsappUrl, 302);
  } catch (error) {
    console.error("Error in group rotation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Check if sequence needs regeneration
 */
function shouldRegenerateSequence(
  group: {
    agentGroups?: Array<{ agent?: { id: string } | null }>;
    lastSequenceUpdate?: Date | null;
    sequenceVersion?: number | null;
    strategy: string;
  },
  currentAgents: Array<{ id: string }>
): boolean {
  // Check if agents have changed
  const currentAgentIds = currentAgents.map((agent) => agent.id).sort();
  const storedAgentIds = (group.agentGroups || [])
    .map((ag) => ag.agent?.id)
    .filter(Boolean)
    .sort();

  if (JSON.stringify(currentAgentIds) !== JSON.stringify(storedAgentIds)) {
    return true;
  }

  // Check if strategy changed
  if (group.lastSequenceUpdate && group.sequenceVersion) {
    const timeSinceUpdate =
      Date.now() - new Date(group.lastSequenceUpdate).getTime();
    const oneHour = 60 * 60 * 1000;

    // Regenerate if more than 1 hour has passed (for random strategy)
    if (group.strategy === "random" && timeSinceUpdate > oneHour) {
      return true;
    }
  }

  return false;
}

/**
 * Log click asynchronously
 */
async function logClickAsync(
  groupId: string,
  agentId: string,
  request: NextRequest
): Promise<void> {
  try {
    const userAgent = request.headers.get("user-agent") || undefined;
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ipAddress = forwardedFor?.split(",")[0] || realIp || undefined;
    const referer = request.headers.get("referer") || undefined;

    await db.click.create({
      data: {
        agentId,
        groupId,
        userAgent,
        ipAddress,
        referrer: referer,
      },
    });
  } catch (error) {
    console.error("Error logging click:", error);
    // Don't throw - logging failure shouldn't break rotation
  }
}

/**
 * Get rotation statistics for a group
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ groupSlug: string }> }
): Promise<NextResponse> {
  try {
    await requireAuth(); // Only authenticated users can view stats

    const { groupSlug } = await params;

    const group = await db.group.findFirst({
      where: {
        slug: groupSlug,
      },
      include: {
        agentGroups: {
          include: {
            agent: true,
          },
        },
        clicks: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1000, // Last 1000 clicks for analysis
        },
      },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Calculate sequence statistics
    const sequenceStats = group.rotationSequence
      ? calculateSequenceStats(group.rotationSequence)
      : null;

    // Calculate actual click distribution
    const clickDistribution: Record<string, number> = {};
    group.clicks.forEach((click) => {
      const agentId = click.agentId;
      clickDistribution[agentId] = (clickDistribution[agentId] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      data: {
        group: {
          id: group.id,
          name: group.name,
          slug: group.slug,
          strategy: group.strategy,
          currentIndex: group.currentIndex,
          sequenceVersion: group.sequenceVersion,
          lastSequenceUpdate: group.lastSequenceUpdate,
        },
        sequenceStats,
        clickDistribution,
        totalClicks: group.clicks.length,
      },
    });
  } catch (error) {
    console.error("Error getting rotation stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
