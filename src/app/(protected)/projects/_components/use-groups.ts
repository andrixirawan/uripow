import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { GroupWithRelationsType, PaginationType } from "@/types";

// Query keys
export const groupsKeys = {
  all: ["groups"] as const,
  lists: () => [...groupsKeys.all, "list"] as const,
  list: (filters: { page: number; limit: number; search: string }) =>
    [...groupsKeys.lists(), filters] as const,
};

// Types
interface GroupsResponse {
  groups: GroupWithRelationsType[];
  pagination: PaginationType;
}

interface UseGroupsParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Fetch groups function
async function fetchGroups(params: UseGroupsParams): Promise<GroupsResponse> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.search) searchParams.set("search", params.search);

  const response = await fetch(`/api/groups?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch groups");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch groups");
  }

  return result.data;
}

// Create group function
async function createGroup(data: {
  name: string;
  slug: string;
  description?: string;
  strategy: "round-robin" | "random";
}): Promise<GroupWithRelationsType> {
  const response = await fetch("/api/groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to create group");
  }

  return result.data;
}

// Update group function
async function updateGroup(
  groupId: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    strategy?: "round-robin" | "random";
    isActive?: boolean;
  }
): Promise<GroupWithRelationsType> {
  const response = await fetch(`/api/groups/${groupId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to update group");
  }

  return result.data;
}

// Delete group function
async function deleteGroup(groupId: string): Promise<void> {
  const response = await fetch(`/api/groups/${groupId}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to delete group");
  }
}

// Toggle group status function
async function toggleGroupStatus(
  groupId: string
): Promise<GroupWithRelationsType> {
  const response = await fetch(`/api/groups/${groupId}/toggle`, {
    method: "PATCH",
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to toggle group status");
  }

  return result.data;
}

// Custom hooks
export function useGroups(params: UseGroupsParams = {}) {
  const { page = 1, limit = 10, search = "" } = params;

  return useQuery({
    queryKey: groupsKeys.list({ page, limit, search }),
    queryFn: () => fetchGroups({ page, limit, search }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      // Invalidate and refetch groups list
      queryClient.invalidateQueries({ queryKey: groupsKeys.lists() });
      toast.success("Project berhasil dibuat!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal membuat project");
    },
  });
}

export function useUpdateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      data,
    }: {
      groupId: string;
      data: {
        name?: string;
        slug?: string;
        description?: string;
        strategy?: "round-robin" | "random";
        isActive?: boolean;
      };
    }) => updateGroup(groupId, data),
    onSuccess: () => {
      // Invalidate and refetch groups list
      queryClient.invalidateQueries({ queryKey: groupsKeys.lists() });
      toast.success("Project berhasil diperbarui!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal memperbarui project");
    },
  });
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      // Invalidate and refetch groups list
      queryClient.invalidateQueries({ queryKey: groupsKeys.lists() });
      toast.success("Project berhasil dihapus!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menghapus project");
    },
  });
}

export function useToggleGroupStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleGroupStatus,
    onSuccess: () => {
      // Invalidate and refetch groups list
      queryClient.invalidateQueries({ queryKey: groupsKeys.lists() });
      toast.success("Status project berhasil diubah!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal mengubah status project");
    },
  });
}
