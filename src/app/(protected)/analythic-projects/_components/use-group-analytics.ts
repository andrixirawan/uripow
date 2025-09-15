import { useQuery } from "@tanstack/react-query";

// Query keys
export const groupAnalyticsKeys = {
  all: ["group-analytics"] as const,
  groups: () => [...groupAnalyticsKeys.all, "groups"] as const,
  groupStats: (days: number, groupId: string) =>
    [...groupAnalyticsKeys.groups(), "stats", days, groupId] as const,
};

interface HourlyData {
  hour: number;
  clicks: number;
}

interface DailyData {
  date: string;
  clicks: number;
}

interface AgentDistribution {
  name: string;
  clicks: number;
}

interface GroupDistribution {
  name: string;
  clicks: number;
}

interface GroupStats {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  strategy: string;
  clickCount: number;
  agentCount: number;
}

interface GroupAnalyticsData {
  totalClicks: number;
  hourlyData: HourlyData[];
  dailyData: DailyData[];
  agentDistribution: AgentDistribution[];
  groupDistribution: GroupDistribution[];
  groupStats: GroupStats[];
}

interface UseGroupAnalyticsParams {
  days?: number;
  groupId?: string;
}

async function fetchGroupAnalytics(
  params: UseGroupAnalyticsParams
): Promise<GroupAnalyticsData> {
  const { days = 7, groupId = "all" } = params;
  const searchParams = new URLSearchParams();
  searchParams.set("days", days.toString());
  searchParams.set("group", groupId);

  const response = await fetch(
    `/api/analytics/groups?${searchParams.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch group analytics");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch group analytics");
  }

  return result.data;
}

export function useGroupAnalytics(params: UseGroupAnalyticsParams = {}) {
  const { days = 7, groupId = "all" } = params;

  return useQuery({
    queryKey: groupAnalyticsKeys.groupStats(days, groupId),
    queryFn: () => fetchGroupAnalytics({ days, groupId }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
