import { db } from "./db";
import { requireAuth } from "../modules/auth/require-auth";
import {
  CreateAgentType,
  CreateGroupType,
  AgentWithRelationsType,
  GroupWithRelationsType,
  UserAnalyticsType,
} from "@/types";

/**
 * Utility functions untuk database operations dengan multi-user support
 */

/**
 * Mendapatkan semua agent milik user yang sedang login
 */
export async function getUserAgents(): Promise<AgentWithRelationsType[]> {
  const session = await requireAuth();

  return await db.agent.findMany({
    where: {
      userId: session.user.id,
      // Remove isActive filter to get all agents (active and inactive)
    },
    include: {
      agentGroups: {
        include: {
          group: true,
        },
      },
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
}

/**
 * Mendapatkan semua group milik user yang sedang login
 */
export async function getUserGroups(): Promise<GroupWithRelationsType[]> {
  const session = await requireAuth();

  return await db.group.findMany({
    where: {
      userId: session.user.id,
      // Remove isActive filter to get all groups (active and inactive)
    },
    include: {
      agentGroups: {
        include: {
          agent: true,
        },
      },
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
}

/**
 * Membuat agent baru untuk user yang sedang login
 */
export async function createUserAgent(data: CreateAgentType) {
  const session = await requireAuth();

  // Check if phone number already exists for this user
  const existingAgent = await db.agent.findFirst({
    where: {
      phoneNumber: data.phoneNumber,
      userId: session.user.id,
    },
  });

  if (existingAgent) {
    throw new Error("Phone number already exists in your agents");
  }

  return await db.agent.create({
    data: {
      ...data,
      userId: session.user.id,
      weight: data.weight || 1,
    },
  });
}

/**
 * Membuat group baru untuk user yang sedang login
 */
export async function createUserGroup(data: CreateGroupType) {
  const session = await requireAuth();

  return await db.group.create({
    data: {
      ...data,
      userId: session.user.id,
      strategy: data.strategy || "round-robin",
    },
  });
}

/**
 * Menambahkan agent ke group (dengan validasi ownership)
 */
export async function addAgentToGroup(agentId: string, groupId: string) {
  const session = await requireAuth();

  // Validasi bahwa agent dan group milik user yang sama
  const agent = await db.agent.findFirst({
    where: {
      id: agentId,
      userId: session.user.id,
    },
  });

  const group = await db.group.findFirst({
    where: {
      id: groupId,
      userId: session.user.id,
    },
  });

  if (!agent || !group) {
    throw new Error("Agent atau Group tidak ditemukan atau bukan milik Anda");
  }

  return await db.agentGroup.create({
    data: {
      agentId,
      groupId,
    },
  });
}

/**
 * Mendapatkan analytics untuk user yang sedang login
 */
export async function getUserAnalytics(): Promise<UserAnalyticsType> {
  const session = await requireAuth();

  const [totalAgents, totalGroups, totalClicks, recentClicks] =
    await Promise.all([
      db.agent.count({
        where: { userId: session.user.id },
      }),
      db.group.count({
        where: { userId: session.user.id },
      }),
      db.click.count({
        where: {
          agent: {
            userId: session.user.id,
          },
        },
      }),
      db.click.findMany({
        where: {
          agent: {
            userId: session.user.id,
          },
        },
        include: {
          agent: true,
          group: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      }),
    ]);

  return {
    totalAgents,
    totalGroups,
    totalClicks,
    recentClicks,
  };
}

/**
 * Mendapatkan rotation settings untuk user yang sedang login
 */
export async function getUserRotationSettings() {
  const session = await requireAuth();

  let settings = await db.rotationSettings.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  // Jika belum ada settings, buat default
  if (!settings) {
    settings = await db.rotationSettings.create({
      data: {
        userId: session.user.id,
        strategy: "round-robin",
      },
    });
  }

  return settings;
}

/**
 * Update rotation settings untuk user yang sedang login
 */
export async function updateUserRotationSettings(strategy: string) {
  const session = await requireAuth();

  return await db.rotationSettings.upsert({
    where: {
      userId: session.user.id,
    },
    update: {
      strategy,
    },
    create: {
      userId: session.user.id,
      strategy,
    },
  });
}

/**
 * Toggle agent status (active/inactive) untuk user yang sedang login
 */
export async function toggleAgentStatus(agentId: string) {
  const session = await requireAuth();

  // Verify that the agent belongs to the user
  const agent = await db.agent.findFirst({
    where: {
      id: agentId,
      userId: session.user.id,
    },
  });

  if (!agent) {
    throw new Error("Agent not found or access denied");
  }

  return await db.agent.update({
    where: { id: agentId },
    data: { isActive: !agent.isActive },
  });
}

/**
 * Toggle group status (active/inactive) untuk user yang sedang login
 */
export async function toggleGroupStatus(groupId: string) {
  const session = await requireAuth();

  // Verify that the group belongs to the user
  const group = await db.group.findFirst({
    where: {
      id: groupId,
      userId: session.user.id,
    },
  });

  if (!group) {
    throw new Error("Group not found or access denied");
  }

  return await db.group.update({
    where: { id: groupId },
    data: { isActive: !group.isActive },
  });
}
