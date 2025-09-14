# Types & Schemas Documentation

## Overview

Global types dan schemas untuk WhatsApp Rotator dengan suffix yang konsisten dan menggunakan Prisma client sebagai source of truth.

## File Structure

### `src/types.ts`

Global TypeScript types dengan suffix `Type`:

- **Auth Types**: User, Session, Account, Verification
- **WhatsApp Rotator Types**: Agent, Group, AgentGroup, Click, RotationSettings
- **API Response Types**: ApiResponse, PaginatedResponse
- **Analytics Types**: UserAnalytics, AgentAnalytics, GroupAnalytics
- **Form Types**: AgentForm, GroupForm, AgentGroupForm
- **Utility Types**: Status, SortOrder, Filter, QueryParams

### `src/schemas.ts`

Global Zod schemas dengan suffix `Schema`:

- **Validation Schemas**: Create, Update, Form schemas
- **API Schemas**: Response, Pagination, Query schemas
- **Error Schemas**: ValidationError, AppError
- **Analytics Schemas**: UserAnalytics, DashboardStats

## Naming Convention

### Types (suffix: `Type`)

```typescript
// Base types dari Prisma
export type UserType = User;
export type AgentType = Agent;

// Utility types dengan TypeScript utilities
export type CreateAgentType = Pick<AgentType, "name" | "phoneNumber"> & {
  weight?: number;
};

export type AgentWithRelationsType = AgentType & {
  agentGroups: (AgentGroupType & {
    group: GroupType;
  })[];
  _count: {
    clicks: number;
  };
};
```

### Schemas (suffix: `Schema`)

```typescript
// Validation schemas
export const CreateAgentSchema = z.object({
  name: z.string().min(1, "Nama agent tidak boleh kosong"),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  weight: z.number().int().min(1).max(100).default(1),
});

// Export types dari schemas
export type CreateAgentSchemaType = z.infer<typeof CreateAgentSchema>;
```

## TypeScript Utilities Usage

### Pick

```typescript
// Hanya ambil field tertentu
export type CreateAgentType = Pick<AgentType, "name" | "phoneNumber"> & {
  weight?: number;
};
```

### Omit

```typescript
// Exclude field tertentu
export type UserWithoutSensitiveType = Omit<UserType, "sessions" | "accounts">;
```

### Partial

```typescript
// Semua field optional
export type UpdateAgentType = Partial<
  Pick<AgentType, "name" | "phoneNumber" | "weight" | "isActive">
>;
```

### Intersection Types

```typescript
// Combine types
export type AgentWithRelationsType = AgentType & {
  agentGroups: AgentGroupType[];
  _count: { clicks: number };
};
```

## Schema Validation

### Basic Validation

```typescript
export const CreateAgentSchema = z.object({
  name: z.string().min(1, "Nama agent tidak boleh kosong").max(100),
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Format nomor telepon tidak valid"),
  weight: z.number().int().min(1).max(100).default(1),
});
```

### Custom Validation

```typescript
export const SlugSchema = z
  .string()
  .min(1, "Slug tidak boleh kosong")
  .max(50, "Slug maksimal 50 karakter")
  .regex(
    /^[a-z0-9-]+$/,
    "Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung"
  );
```

### Enum Validation

```typescript
export const RotationStrategySchema = z.enum([
  "round-robin",
  "random",
  "weighted",
]);
```

## API Integration

### Request Validation

```typescript
// Di API route
export async function POST(request: NextRequest) {
  const body = await request.json();

  const validationResult = CreateAgentSchema.safeParse(body);

  if (!validationResult.success) {
    const errors = validationResult.error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return NextResponse.json(
      {
        success: false,
        error: "Validation failed",
        details: errors,
      },
      { status: 400 }
    );
  }

  const { name, phoneNumber, weight } = validationResult.data;
  // ... rest of the logic
}
```

### Response Typing

```typescript
export async function GET(): Promise<NextResponse<ApiResponseType>> {
  try {
    const agents = await getUserAgents();

    return NextResponse.json({
      success: true,
      data: agents,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}
```

## Database Integration

### Type-safe Database Operations

```typescript
export async function createUserAgent(data: CreateAgentType) {
  const session = await requireAuth();

  return await db.agent.create({
    data: {
      ...data,
      userId: session.user.id,
      weight: data.weight || 1,
    },
  });
}
```

### Return Type Annotations

```typescript
export async function getUserAgents(): Promise<AgentWithRelationsType[]> {
  const session = await requireAuth();

  return await db.agent.findMany({
    where: {
      userId: session.user.id,
      isActive: true,
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
```

## Best Practices

### 1. Consistent Naming

- Types: `EntityType`, `CreateEntityType`, `UpdateEntityType`
- Schemas: `EntitySchema`, `CreateEntitySchema`, `UpdateEntitySchema`
- Schema Types: `EntitySchemaType`, `CreateEntitySchemaType`

### 2. Source of Truth

- Prisma client sebagai source of truth untuk base types
- Gunakan TypeScript utilities untuk transformasi
- Zod schemas untuk validation dan runtime type checking

### 3. Type Safety

- Selalu gunakan return type annotations
- Validasi input dengan Zod schemas
- Handle validation errors dengan proper error messages

### 4. Reusability

- Buat utility types yang bisa digunakan di berbagai tempat
- Gunakan intersection types untuk combine functionality
- Export schema types untuk consistency

## Error Handling

### Validation Errors

```typescript
if (!validationResult.success) {
  const errors = validationResult.error.errors.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));

  return NextResponse.json(
    {
      success: false,
      error: "Validation failed",
      details: errors,
    },
    { status: 400 }
  );
}
```

### Type-safe Error Responses

```typescript
export type ApiResponseType<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};
```

## Migration Guide

### From Manual Types to Global Types

1. **Import global types**:

   ```typescript
   import { AgentType, CreateAgentType } from "@/types";
   ```

2. **Replace manual types**:

   ```typescript
   // Before
   interface Agent {
     id: string;
     name: string;
     // ...
   }

   // After
   import { AgentType } from "@/types";
   ```

3. **Use schema validation**:

   ```typescript
   // Before
   if (!name || !phoneNumber) {
     return { error: "Missing required fields" };
   }

   // After
   const validationResult = CreateAgentSchema.safeParse(data);
   if (!validationResult.success) {
     return {
       error: "Validation failed",
       details: validationResult.error.errors,
     };
   }
   ```

## Examples

### Complete CRUD Example

```typescript
// types.ts
export type CreateAgentType = Pick<AgentType, "name" | "phoneNumber"> & {
  weight?: number;
};

// schemas.ts
export const CreateAgentSchema = z.object({
  name: z.string().min(1),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  weight: z.number().int().min(1).max(100).default(1),
});

// api/agents/route.ts
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponseType>> {
  const body = await request.json();
  const validationResult = CreateAgentSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Validation failed",
        details: validationResult.error.errors,
      },
      { status: 400 }
    );
  }

  const agent = await createUserAgent(validationResult.data);

  return NextResponse.json(
    {
      success: true,
      data: agent,
    },
    { status: 201 }
  );
}
```

Sistem types dan schemas ini memberikan type safety yang lengkap, validation yang robust, dan konsistensi di seluruh aplikasi.
