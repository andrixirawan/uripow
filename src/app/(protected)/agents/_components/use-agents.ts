import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AgentWithRelationsType, PaginationType } from "@/types";

// Query keys
export const agentsKeys = {
  all: ["agents"] as const,
  lists: () => [...agentsKeys.all, "list"] as const,
  list: (filters: { page: number; limit: number; search: string }) =>
    [...agentsKeys.lists(), filters] as const,
};

// Types
interface AgentsResponse {
  agents: AgentWithRelationsType[];
  pagination: PaginationType;
}

interface UseAgentsParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Fetch agents function
async function fetchAgents(params: UseAgentsParams): Promise<AgentsResponse> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.search) searchParams.set("search", params.search);

  const response = await fetch(`/api/agents?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch agents");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch agents");
  }

  return result.data;
}

// Create agent function
async function createAgent(data: {
  name: string;
  phoneNumber: string;
  isActive: boolean;
}): Promise<AgentWithRelationsType> {
  const response = await fetch("/api/agents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to create agent");
  }

  return result.data;
}

// Update agent function
async function updateAgent(
  agentId: string,
  data: {
    name?: string;
    phoneNumber?: string;
    isActive?: boolean;
  }
): Promise<AgentWithRelationsType> {
  const response = await fetch(`/api/agents/${agentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to update agent");
  }

  return result.data;
}

// Delete agent function
async function deleteAgent(agentId: string): Promise<void> {
  const response = await fetch(`/api/agents/${agentId}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to delete agent");
  }
}

// Toggle agent status function
async function toggleAgentStatus(
  agentId: string
): Promise<AgentWithRelationsType> {
  const response = await fetch(`/api/agents/${agentId}/toggle`, {
    method: "PATCH",
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to toggle agent status");
  }

  return result.data;
}

// Custom hooks
export function useAgents(params: UseAgentsParams = {}) {
  const { page = 1, limit = 10, search = "" } = params;

  return useQuery({
    queryKey: agentsKeys.list({ page, limit, search }),
    queryFn: () => fetchAgents({ page, limit, search }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAgent,
    onSuccess: () => {
      // Invalidate and refetch agents list
      queryClient.invalidateQueries({ queryKey: agentsKeys.lists() });
      toast.success("Agent berhasil dibuat!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal membuat agent");
    },
  });
}

export function useUpdateAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      agentId,
      data,
    }: {
      agentId: string;
      data: { name?: string; phoneNumber?: string; isActive?: boolean };
    }) => updateAgent(agentId, data),
    onSuccess: () => {
      // Invalidate and refetch agents list
      queryClient.invalidateQueries({ queryKey: agentsKeys.lists() });
      toast.success("Agent berhasil diperbarui!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal memperbarui agent");
    },
  });
}

export function useDeleteAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAgent,
    onSuccess: () => {
      // Invalidate and refetch agents list
      queryClient.invalidateQueries({ queryKey: agentsKeys.lists() });
      toast.success("Agent berhasil dihapus!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menghapus agent");
    },
  });
}

export function useToggleAgentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleAgentStatus,
    onSuccess: () => {
      // Invalidate and refetch agents list
      queryClient.invalidateQueries({ queryKey: agentsKeys.lists() });
      toast.success("Status agent berhasil diubah!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal mengubah status agent");
    },
  });
}
