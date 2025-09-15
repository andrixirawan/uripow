import {
  User,
  Session,
  Account,
  Verification,
  Agent,
  Group,
  AgentGroup,
  Click,
  RotationSettings,
} from "@/generated/prisma";

// ===== AUTH TYPES =====

// Base types dari Prisma
export type UserType = User;
export type SessionType = Session;
export type AccountType = Account;
export type VerificationType = Verification;

// Auth utility types
export type UserWithoutSensitiveType = Omit<UserType, "sessions" | "accounts">;
export type SessionWithUserType = SessionType & { user: UserType };
export type AccountWithUserType = AccountType & { user: UserType };

// ===== WHATSAPP ROTATOR TYPES =====

// Base types dari Prisma
export type AgentType = Agent;
export type GroupType = Group;

// Pagination types
export interface PaginationType {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponseType<T> {
  data: T[];
  pagination: PaginationType;
}
export type AgentGroupType = AgentGroup;
export type ClickType = Click;
export type RotationSettingsType = RotationSettings;

// Agent types
export type AgentWithRelationsType = AgentType & {
  agentGroups: (AgentGroupType & {
    group: GroupType;
  })[];
  _count: {
    clicks: number;
  };
};

export type AgentWithGroupsType = AgentType & {
  agentGroups: (AgentGroupType & {
    group: GroupType;
  })[];
};

export type CreateAgentType = Pick<AgentType, "name" | "phoneNumber">;

export type UpdateAgentType = Partial<
  Pick<AgentType, "name" | "phoneNumber" | "isActive">
>;

// Group types
export type GroupWithRelationsType = GroupType & {
  agentGroups: (AgentGroupType & {
    agent: AgentType;
  })[];
  _count: {
    clicks: number;
  };
};

export type GroupWithAgentsType = GroupType & {
  agentGroups: (AgentGroupType & {
    agent: AgentType;
  })[];
};

export type CreateGroupType = Pick<GroupType, "name" | "slug"> & {
  description?: string;
  strategy?: string;
};

export type UpdateGroupType = Partial<
  Pick<GroupType, "name" | "slug" | "description" | "strategy" | "isActive">
>;

// AgentGroup types
export type CreateAgentGroupType = Pick<
  AgentGroupType,
  "agentId" | "groupId"
> & {
  weight?: number;
};

export type UpdateAgentGroupType = Partial<
  Pick<AgentGroupType, "weight" | "isActive">
>;

// Click types
export type ClickWithRelationsType = ClickType & {
  agent: AgentType;
  group: GroupType | null;
};

export type CreateClickType = Pick<ClickType, "agentId"> & {
  groupId?: string;
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
};

// RotationSettings types
export type CreateRotationSettingsType = Pick<RotationSettingsType, "strategy">;
export type UpdateRotationSettingsType = Partial<
  Pick<RotationSettingsType, "strategy">
>;

// ===== API RESPONSE TYPES =====

export type ApiResponseType<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponseType<T = unknown> = ApiResponseType<T> & {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// ===== ANALYTICS TYPES =====

export type UserAnalyticsType = {
  totalAgents: number;
  totalGroups: number;
  totalClicks: number;
  recentClicks: ClickWithRelationsType[];
};

export type AgentAnalyticsType = {
  agent: AgentType;
  totalClicks: number;
  clicksByGroup: {
    group: GroupType | null;
    count: number;
  }[];
  recentClicks: ClickWithRelationsType[];
};

export type GroupAnalyticsType = {
  group: GroupType;
  totalClicks: number;
  clicksByAgent: {
    agent: AgentType;
    count: number;
  }[];
  recentClicks: ClickWithRelationsType[];
};

// ===== ROTATION STRATEGY TYPES =====

export type RotationStrategyType = "round-robin" | "random";

export type RotationResultType = {
  agent: AgentType;
  group: GroupType;
  strategy: RotationStrategyType;
  timestamp: Date;
};

// ===== FORM TYPES =====

export type AgentFormType = {
  name: string;
  phoneNumber: string;
};

export type GroupFormType = {
  name: string;
  slug: string;
  description: string;
  strategy: RotationStrategyType;
};

export type AgentGroupFormType = {
  agentId: string;
  groupId: string;
  weight: number;
};

// ===== DASHBOARD TYPES =====

export type DashboardStatsType = {
  totalAgents: number;
  totalGroups: number;
  totalClicks: number;
  activeAgents: number;
  activeGroups: number;
  clicksToday: number;
  clicksThisWeek: number;
  clicksThisMonth: number;
};

export type DashboardRecentActivityType = {
  type:
    | "agent_created"
    | "group_created"
    | "click"
    | "agent_updated"
    | "group_updated";
  timestamp: Date;
  description: string;
  metadata?: Record<string, unknown>;
};

// ===== ERROR TYPES =====

export type AppErrorType = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
};

export type ValidationErrorType = {
  field: string;
  message: string;
  value?: unknown;
};

// ===== UTILITY TYPES =====

export type StatusType = "active" | "inactive" | "pending" | "error";

export type SortOrderType = "asc" | "desc";

export type SortFieldType<T = Record<string, unknown>> = keyof T;

export type FilterType<T = Record<string, unknown>> = {
  field: keyof T;
  operator:
    | "equals"
    | "contains"
    | "startsWith"
    | "endsWith"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "in"
    | "notIn";
  value: unknown;
};

export type QueryParamsType = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrderType;
  search?: string;
  filters?: FilterType[];
};
