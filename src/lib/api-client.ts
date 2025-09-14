import { apiClient, ApiResponse } from "./axios";
import {
  AgentType,
  GroupType,
  AgentGroupType,
  ClickType,
  CreateAgentType,
  CreateGroupType,
  CreateAgentGroupType,
  UpdateAgentType,
  UpdateGroupType,
  UpdateAgentGroupType,
  UserAnalyticsType,
  DashboardStatsType,
  RotationSettingsType,
} from "@/types";

/**
 * API Client untuk WhatsApp Rotator
 * Wrapper untuk axios dengan type safety
 */

// Agents API
export const agentsApi = {
  // Get all agents
  getAll: (): Promise<ApiResponse<AgentType[]>> => apiClient.get("/agents"),

  // Get agent by ID
  getById: (id: string): Promise<ApiResponse<AgentType>> =>
    apiClient.get(`/agents/${id}`),

  // Create new agent
  create: (data: CreateAgentType): Promise<ApiResponse<AgentType>> =>
    apiClient.post("/agents", data),

  // Update agent
  update: (
    id: string,
    data: UpdateAgentType
  ): Promise<ApiResponse<AgentType>> => apiClient.put(`/agents/${id}`, data),

  // Delete agent
  delete: (id: string): Promise<ApiResponse<void>> =>
    apiClient.delete(`/agents/${id}`),

  // Toggle agent status
  toggleStatus: (id: string): Promise<ApiResponse<AgentType>> =>
    apiClient.patch(`/agents/${id}/toggle`),
};

// Groups API
export const groupsApi = {
  // Get all groups
  getAll: (): Promise<ApiResponse<GroupType[]>> => apiClient.get("/groups"),

  // Get group by ID
  getById: (id: string): Promise<ApiResponse<GroupType>> =>
    apiClient.get(`/groups/${id}`),

  // Get group by slug
  getBySlug: (slug: string): Promise<ApiResponse<GroupType>> =>
    apiClient.get(`/groups/slug/${slug}`),

  // Create new group
  create: (data: CreateGroupType): Promise<ApiResponse<GroupType>> =>
    apiClient.post("/groups", data),

  // Update group
  update: (
    id: string,
    data: UpdateGroupType
  ): Promise<ApiResponse<GroupType>> => apiClient.put(`/groups/${id}`, data),

  // Delete group
  delete: (id: string): Promise<ApiResponse<void>> =>
    apiClient.delete(`/groups/${id}`),

  // Toggle group status
  toggleStatus: (id: string): Promise<ApiResponse<GroupType>> =>
    apiClient.patch(`/groups/${id}/toggle`),
};

// Agent Groups API
export const agentGroupsApi = {
  // Get all agent groups
  getAll: (): Promise<ApiResponse<AgentGroupType[]>> =>
    apiClient.get("/agent-groups"),

  // Get agent groups by agent ID
  getByAgent: (agentId: string): Promise<ApiResponse<AgentGroupType[]>> =>
    apiClient.get(`/agent-groups/agent/${agentId}`),

  // Get agent groups by group ID
  getByGroup: (groupId: string): Promise<ApiResponse<AgentGroupType[]>> =>
    apiClient.get(`/agent-groups/group/${groupId}`),

  // Create new agent group
  create: (data: CreateAgentGroupType): Promise<ApiResponse<AgentGroupType>> =>
    apiClient.post("/agent-groups", data),

  // Update agent group
  update: (
    id: string,
    data: UpdateAgentGroupType
  ): Promise<ApiResponse<AgentGroupType>> =>
    apiClient.put(`/agent-groups/${id}`, data),

  // Delete agent group
  delete: (id: string): Promise<ApiResponse<void>> =>
    apiClient.delete(`/agent-groups/${id}`),

  // Remove agent from group
  removeAgentFromGroup: (
    agentId: string,
    groupId: string
  ): Promise<ApiResponse<void>> =>
    apiClient.delete(`/agent-groups/agent/${agentId}/group/${groupId}`),
};

// Analytics API
export const analyticsApi = {
  // Get user analytics
  getUserAnalytics: (): Promise<ApiResponse<UserAnalyticsType>> =>
    apiClient.get("/analytics/user"),

  // Get dashboard stats
  getDashboardStats: (): Promise<ApiResponse<DashboardStatsType>> =>
    apiClient.get("/analytics/dashboard"),

  // Get agent analytics
  getAgentAnalytics: (agentId: string): Promise<ApiResponse<unknown>> =>
    apiClient.get(`/analytics/agent/${agentId}`),

  // Get group analytics
  getGroupAnalytics: (groupId: string): Promise<ApiResponse<unknown>> =>
    apiClient.get(`/analytics/group/${groupId}`),

  // Get clicks analytics
  getClicksAnalytics: (params?: {
    startDate?: string;
    endDate?: string;
    agentId?: string;
    groupId?: string;
  }): Promise<ApiResponse<ClickType[]>> =>
    apiClient.get("/analytics/clicks", { params }),
};

// Rotation API
export const rotationApi = {
  // Get rotation settings
  getSettings: (): Promise<ApiResponse<RotationSettingsType>> =>
    apiClient.get("/rotate/settings"),

  // Update rotation settings
  updateSettings: (
    strategy: string
  ): Promise<ApiResponse<RotationSettingsType>> =>
    apiClient.put("/rotate/settings", { strategy }),

  // Get next agent for rotation
  getNextAgent: (groupId: string): Promise<ApiResponse<AgentType>> =>
    apiClient.get(`/rotate/${groupId}/next`),

  // Record click/rotation
  recordClick: (data: {
    agentId: string;
    groupId?: string;
    userAgent?: string;
    ipAddress?: string;
    referrer?: string;
  }): Promise<ApiResponse<ClickType>> => apiClient.post("/rotate/click", data),
};

// Settings API
export const settingsApi = {
  // Get all settings
  getAll: (): Promise<ApiResponse<unknown>> => apiClient.get("/settings"),

  // Update settings
  update: (data: unknown): Promise<ApiResponse<unknown>> =>
    apiClient.put("/settings", data),
};

// Export all APIs
export const api = {
  agents: agentsApi,
  groups: groupsApi,
  agentGroups: agentGroupsApi,
  analytics: analyticsApi,
  rotation: rotationApi,
  settings: settingsApi,
};

// Export default
export default api;
