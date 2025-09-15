import { useQuery } from "@tanstack/react-query";
import { AgentWithRelationsType } from "@/types";

// Query keys
export const analyticsKeys = {
  all: ["analytics"] as const,
  agents: () => [...analyticsKeys.all, "agents"] as const,
  agentStats: (days: number) =>
    [...analyticsKeys.agents(), "stats", days] as const,
};

interface AgentStats {
  agentId: string;
  agentName: string;
  totalClicks: number;
  lastClick: string | null;
}

interface TimeStats {
  date: string;
  clicks: number;
}

interface HourlyStats {
  hour: number;
  clicks: number;
}

interface AnalyticsData {
  agentStats: AgentStats[];
  timeStats: TimeStats[];
  hourlyStats: HourlyStats[];
  totalClicks: number;
  clicksToday: number;
  avgClicksPerDay: number;
  peakHour: number;
}

interface UseAnalyticsParams {
  days?: number;
}

async function fetchAnalytics(
  params: UseAnalyticsParams
): Promise<AnalyticsData> {
  const { days = 7 } = params;
  const searchParams = new URLSearchParams();
  searchParams.set("days", days.toString());

  const response = await fetch(`/api/analytics?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch analytics");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch analytics");
  }

  return result.data;
}

export function useAnalytics(params: UseAnalyticsParams = {}) {
  const { days = 7 } = params;

  return useQuery({
    queryKey: analyticsKeys.agentStats(days),
    queryFn: () => fetchAnalytics({ days }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

async function fetchAgents(): Promise<AgentWithRelationsType[]> {
  const response = await fetch("/api/agents");

  if (!response.ok) {
    throw new Error("Failed to fetch agents");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch agents");
  }

  return result.data.agents;
}

export function useAgents() {
  return useQuery({
    queryKey: ["agents", "list"],
    queryFn: fetchAgents,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
