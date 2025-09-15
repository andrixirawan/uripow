import { useQuery } from "@tanstack/react-query";
import { AgentWithRelationsType, GroupWithRelationsType } from "@/types";

// Query keys
export const dashboardKeys = {
  all: ["dashboard"] as const,
  overview: () => [...dashboardKeys.all, "overview"] as const,
  agents: () => [...dashboardKeys.overview(), "agents"] as const,
  groups: () => [...dashboardKeys.overview(), "groups"] as const,
  settings: () => [...dashboardKeys.overview(), "settings"] as const,
};

interface RotationSettings {
  id: string;
  strategy: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Fetch agents for dashboard (without pagination for overview)
async function fetchDashboardAgents(): Promise<AgentWithRelationsType[]> {
  const response = await fetch("/api/agents?limit=100"); // Get more agents for dashboard

  if (!response.ok) {
    throw new Error("Failed to fetch agents");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch agents");
  }

  return result.data.agents || result.data || [];
}

// Fetch groups for dashboard (without pagination for overview)
async function fetchDashboardGroups(): Promise<GroupWithRelationsType[]> {
  const response = await fetch("/api/groups?limit=100"); // Get more groups for dashboard

  if (!response.ok) {
    throw new Error("Failed to fetch groups");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch groups");
  }

  return result.data.groups || result.data || [];
}

// Fetch rotation settings
async function fetchRotationSettings(): Promise<RotationSettings | null> {
  const response = await fetch("/api/settings");

  if (!response.ok) {
    throw new Error("Failed to fetch settings");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch settings");
  }

  return result.data || null;
}

export function useDashboardAgents() {
  return useQuery({
    queryKey: dashboardKeys.agents(),
    queryFn: fetchDashboardAgents,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useDashboardGroups() {
  return useQuery({
    queryKey: dashboardKeys.groups(),
    queryFn: fetchDashboardGroups,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRotationSettings() {
  return useQuery({
    queryKey: dashboardKeys.settings(),
    queryFn: fetchRotationSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Combined hook for dashboard overview
export function useDashboardOverview() {
  const agentsQuery = useDashboardAgents();
  const groupsQuery = useDashboardGroups();
  const settingsQuery = useRotationSettings();

  return {
    agents: agentsQuery.data || [],
    groups: groupsQuery.data || [],
    settings: settingsQuery.data,
    isLoading:
      agentsQuery.isLoading || groupsQuery.isLoading || settingsQuery.isLoading,
    error: agentsQuery.error || groupsQuery.error || settingsQuery.error,
    refetch: () => {
      agentsQuery.refetch();
      groupsQuery.refetch();
      settingsQuery.refetch();
    },
  };
}
