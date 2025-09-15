import { z } from "zod";

// ===== AUTH SCHEMAS =====

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nama tidak boleh kosong"),
  email: z.string().email("Email tidak valid"),
  emailVerified: z.boolean().default(false),
  image: z.string().url().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const SessionSchema = z.object({
  id: z.string(),
  expiresAt: z.date(),
  token: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  userId: z.string(),
});

export const AccountSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  providerId: z.string(),
  userId: z.string(),
  accessToken: z.string().optional().nullable(),
  refreshToken: z.string().optional().nullable(),
  idToken: z.string().optional().nullable(),
  accessTokenExpiresAt: z.date().optional().nullable(),
  refreshTokenExpiresAt: z.date().optional().nullable(),
  scope: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// ===== WHATSAPP ROTATOR SCHEMAS =====

// Agent schemas
export const CreateAgentSchema = z.object({
  name: z
    .string()
    .min(1, "Nama agent tidak boleh kosong")
    .max(100, "Nama agent maksimal 100 karakter"),
  phoneNumber: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(15, "Nomor telepon maksimal 15 digit")
    .regex(/^\+?[1-9]\d{9,14}$/, "Format nomor telepon tidak valid"),
  isActive: z.boolean().default(true),
});

export const UpdateAgentSchema = z.object({
  name: z
    .string()
    .min(1, "Nama agent tidak boleh kosong")
    .max(100, "Nama agent maksimal 100 karakter")
    .optional(),
  phoneNumber: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(15, "Nomor telepon maksimal 15 digit")
    .regex(/^\+?[1-9]\d{9,14}$/, "Format nomor telepon tidak valid")
    .optional(),
  isActive: z.boolean().optional(),
});

export const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
  isActive: z.boolean(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Group schemas
export const CreateGroupSchema = z.object({
  name: z
    .string()
    .min(1, "Nama group tidak boleh kosong")
    .max(100, "Nama group maksimal 100 karakter"),
  slug: z
    .string()
    .min(1, "Slug tidak boleh kosong")
    .max(50, "Slug maksimal 50 karakter")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung"
    ),
  description: z
    .string()
    .max(500, "Deskripsi maksimal 500 karakter")
    .optional(),
  strategy: z.enum(["round-robin", "random"]).default("round-robin"),
  isActive: z.boolean().default(true),
});

export const UpdateGroupSchema = z.object({
  name: z
    .string()
    .min(1, "Nama group tidak boleh kosong")
    .max(100, "Nama group maksimal 100 karakter")
    .optional(),
  slug: z
    .string()
    .min(1, "Slug tidak boleh kosong")
    .max(50, "Slug maksimal 50 karakter")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung"
    )
    .optional(),
  description: z
    .string()
    .max(500, "Deskripsi maksimal 500 karakter")
    .optional(),
  strategy: z.enum(["round-robin", "random"]).optional(),
  isActive: z.boolean().optional(),
});

export const GroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  isActive: z.boolean(),
  strategy: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// AgentGroup schemas
export const CreateAgentGroupSchema = z.object({
  agentId: z.string().min(1, "Agent ID tidak boleh kosong"),
  groupId: z.string().min(1, "Group ID tidak boleh kosong"),
  weight: z.number().int().min(1).max(100).default(1),
});

export const UpdateAgentGroupSchema = z.object({
  weight: z.number().int().min(1).max(100).optional(),
  isActive: z.boolean().optional(),
});

export const AgentGroupSchema = z.object({
  id: z.string(),
  agentId: z.string(),
  groupId: z.string(),
  weight: z.number().int(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Click schemas
export const CreateClickSchema = z.object({
  agentId: z.string().min(1, "Agent ID tidak boleh kosong"),
  groupId: z.string().optional(),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
  referrer: z.string().url().optional(),
});

export const ClickSchema = z.object({
  id: z.string(),
  agentId: z.string(),
  groupId: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  ipAddress: z.string().optional().nullable(),
  referrer: z.string().optional().nullable(),
  createdAt: z.date(),
});

// RotationSettings schemas
export const CreateRotationSettingsSchema = z.object({
  strategy: z.enum(["round-robin", "random", "weighted"]),
});

export const UpdateRotationSettingsSchema = z.object({
  strategy: z.enum(["round-robin", "random", "weighted"]),
});

export const RotationSettingsSchema = z.object({
  id: z.string(),
  strategy: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// ===== API SCHEMAS =====

export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
});

export const PaginatedResponseSchema = ApiResponseSchema.extend({
  pagination: PaginationSchema.optional(),
});

// ===== QUERY SCHEMAS =====

export const QueryParamsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().optional(),
});

export const FilterSchema = z.object({
  field: z.string(),
  operator: z.enum([
    "equals",
    "contains",
    "startsWith",
    "endsWith",
    "gt",
    "gte",
    "lt",
    "lte",
    "in",
    "notIn",
  ]),
  value: z.any(),
});

// ===== FORM SCHEMAS =====

export const AgentFormSchema = z.object({
  name: z
    .string()
    .min(1, "Nama agent tidak boleh kosong")
    .max(100, "Nama agent maksimal 100 karakter"),
  phoneNumber: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(13, "Nomor telepon maksimal 13 digit")
    .regex(
      /^[1-9]\d{9,12}$/,
      "Format nomor telepon tidak valid (10-13 digit tanpa 0 atau +62)"
    )
    .refine(
      (val) => !val.startsWith("62"),
      "Nomor telepon tidak boleh dimulai dengan 62"
    ),
  isActive: z.boolean(),
});

export const GroupFormSchema = z.object({
  name: z
    .string()
    .min(1, "Nama group tidak boleh kosong")
    .max(100, "Nama group maksimal 100 karakter"),
  slug: z
    .string()
    .min(1, "Slug tidak boleh kosong")
    .max(50, "Slug maksimal 50 karakter")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung"
    ),
  description: z
    .string()
    .max(500, "Deskripsi maksimal 500 karakter")
    .default(""),
  strategy: z.enum(["round-robin", "random"]).default("round-robin"),
});

export const AgentGroupFormSchema = z.object({
  agentId: z.string().min(1, "Pilih agent"),
  groupId: z.string().min(1, "Pilih group"),
  weight: z.coerce.number().int().min(1).max(100).default(1),
});

// ===== VALIDATION SCHEMAS =====

export const PhoneNumberSchema = z
  .string()
  .min(10, "Nomor telepon minimal 10 digit")
  .max(15, "Nomor telepon maksimal 15 digit")
  .regex(/^\+?[1-9]\d{1,14}$/, "Format nomor telepon tidak valid");

export const SlugSchema = z
  .string()
  .min(1, "Slug tidak boleh kosong")
  .max(50, "Slug maksimal 50 karakter")
  .regex(
    /^[a-z0-9-]+$/,
    "Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung"
  );

export const EmailSchema = z.string().email("Email tidak valid");

export const PasswordSchema = z
  .string()
  .min(8, "Password minimal 8 karakter")
  .max(100, "Password maksimal 100 karakter")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password harus mengandung huruf kecil, huruf besar, dan angka"
  );

// ===== ERROR SCHEMAS =====

export const ValidationErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
  value: z.any().optional(),
});

export const AppErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.string(), z.any()).optional(),
  timestamp: z.date(),
});

// ===== ANALYTICS SCHEMAS =====

export const UserAnalyticsSchema = z.object({
  totalAgents: z.number().int().min(0),
  totalGroups: z.number().int().min(0),
  totalClicks: z.number().int().min(0),
  recentClicks: z.array(
    ClickSchema.extend({
      agent: AgentSchema,
      group: GroupSchema.optional().nullable(),
    })
  ),
});

export const DashboardStatsSchema = z.object({
  totalAgents: z.number().int().min(0),
  totalGroups: z.number().int().min(0),
  totalClicks: z.number().int().min(0),
  activeAgents: z.number().int().min(0),
  activeGroups: z.number().int().min(0),
  clicksToday: z.number().int().min(0),
  clicksThisWeek: z.number().int().min(0),
  clicksThisMonth: z.number().int().min(0),
});

// ===== ROTATION SCHEMAS =====

export const RotationStrategySchema = z.enum(["round-robin", "random"]);

export const RotationResultSchema = z.object({
  agent: AgentSchema,
  group: GroupSchema,
  strategy: RotationStrategySchema,
  timestamp: z.date(),
});

// ===== EXPORT TYPES =====

// Export types dari schemas
export type CreateAgentSchemaType = z.infer<typeof CreateAgentSchema>;
export type UpdateAgentSchemaType = z.infer<typeof UpdateAgentSchema>;
export type AgentSchemaType = z.infer<typeof AgentSchema>;

export type CreateGroupSchemaType = z.infer<typeof CreateGroupSchema>;
export type UpdateGroupSchemaType = z.infer<typeof UpdateGroupSchema>;
export type GroupSchemaType = z.infer<typeof GroupSchema>;

export type CreateAgentGroupSchemaType = z.infer<typeof CreateAgentGroupSchema>;
export type UpdateAgentGroupSchemaType = z.infer<typeof UpdateAgentGroupSchema>;
export type AgentGroupSchemaType = z.infer<typeof AgentGroupSchema>;

export type CreateClickSchemaType = z.infer<typeof CreateClickSchema>;
export type ClickSchemaType = z.infer<typeof ClickSchema>;

export type CreateRotationSettingsSchemaType = z.infer<
  typeof CreateRotationSettingsSchema
>;
export type UpdateRotationSettingsSchemaType = z.infer<
  typeof UpdateRotationSettingsSchema
>;
export type RotationSettingsSchemaType = z.infer<typeof RotationSettingsSchema>;

export type ApiResponseSchemaType = z.infer<typeof ApiResponseSchema>;
export type PaginatedResponseSchemaType = z.infer<
  typeof PaginatedResponseSchema
>;

export type QueryParamsSchemaType = z.infer<typeof QueryParamsSchema>;
export type FilterSchemaType = z.infer<typeof FilterSchema>;

export type AgentFormSchemaType = z.infer<typeof AgentFormSchema>;
export type GroupFormSchemaType = z.infer<typeof GroupFormSchema>;
export type AgentGroupFormSchemaType = z.infer<typeof AgentGroupFormSchema>;

export type UserAnalyticsSchemaType = z.infer<typeof UserAnalyticsSchema>;
export type DashboardStatsSchemaType = z.infer<typeof DashboardStatsSchema>;

export type RotationStrategySchemaType = z.infer<typeof RotationStrategySchema>;
export type RotationResultSchemaType = z.infer<typeof RotationResultSchema>;
