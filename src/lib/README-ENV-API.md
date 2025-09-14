# Environment & API Client Documentation

## Overview

Sistem environment configuration dan global axios instance untuk WhatsApp Rotator dengan support production dan development environment.

## Environment Configuration

### File: `src/lib/env.ts`

#### Environment Variables Pattern

- **Production**: `DATABASE_URL`, `BETTER_AUTH_SECRET`, dll.
- **Development**: `DATABASE_URL_DEV`, `BETTER_AUTH_SECRET`, dll.
- **Fallback**: Development akan fallback ke production env jika `_DEV` tidak ada

#### Configuration Structure

```typescript
export const config = {
  env: {
    isDevelopment,
    isProduction,
    isTest,
  },
  database: databaseConfig,
  auth: authConfig,
  oauth: oauthConfig,
  next: nextConfig,
  api: apiConfig,
  logging: loggingConfig,
  security: securityConfig,
  features: featureFlags,
};
```

#### Environment Variables

##### Required (Production & Development)

```env
# Database
DATABASE_URL=mongodb://localhost:27017/whatsapp-rotator
DATABASE_URL_DEV=mongodb://localhost:27017/whatsapp-rotator-dev

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

##### Optional

```env
# API Configuration
API_TIMEOUT=30000
API_RETRY_ATTEMPTS=3
API_RETRY_DELAY=1000

# Logging
LOG_LEVEL=debug
LOG_ENABLE_CONSOLE=true
LOG_ENABLE_FILE=false

# Security
CORS_ORIGIN=*
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Feature Flags
FEATURE_ANALYTICS=true
FEATURE_CACHING=false
FEATURE_RATE_LIMIT=false
FEATURE_DEBUG_MODE=true
```

#### Usage Examples

##### Basic Usage

```typescript
import { config, getDatabaseUrl } from "@/lib/env";

// Check environment
if (config.env.isDevelopment) {
  console.log("Running in development mode");
}

// Get database URL
const dbUrl = getDatabaseUrl();

// Get API base URL
const apiUrl = config.api.baseUrl;
```

##### Environment Validation

```typescript
import { validateEnvironment } from "@/lib/env";

// Validate all required env vars
validateEnvironment();
```

## Global Axios Instance

### File: `src/lib/axios.ts`

#### Features

- **Automatic retry** untuk network errors dan 429 responses
- **Request/Response logging** di development
- **Error handling** dengan proper error messages
- **Auth token management**
- **File upload/download** support
- **Type-safe responses**

#### Usage Examples

##### Basic API Calls

```typescript
import { apiClient } from "@/lib/axios";

// GET request
const response = await apiClient.get("/agents");
if (response.success) {
  console.log(response.data);
}

// POST request
const response = await apiClient.post("/agents", {
  name: "Agent 1",
  phoneNumber: "+6281234567890",
  weight: 1,
});

// PUT request
const response = await apiClient.put("/agents/123", {
  name: "Updated Agent",
  weight: 2,
});

// DELETE request
const response = await apiClient.delete("/agents/123");
```

##### File Operations

```typescript
// Upload file
const response = await apiClient.upload("/upload", file, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});

// Download file
await apiClient.download("/download/file.pdf", "downloaded-file.pdf");
```

##### Auth Token Management

```typescript
// Set auth token
apiClient.setAuthToken("your-jwt-token");

// Remove auth token
apiClient.removeAuthToken();
```

## API Client Wrapper

### File: `src/lib/api-client.ts`

#### Structured API Calls

```typescript
import { api } from "@/lib/api-client";

// Agents API
const agents = await api.agents.getAll();
const agent = await api.agents.getById("123");
const newAgent = await api.agents.create({
  name: "New Agent",
  phoneNumber: "+6281234567890",
  weight: 1,
});

// Groups API
const groups = await api.groups.getAll();
const group = await api.groups.getBySlug("my-group");

// Analytics API
const analytics = await api.analytics.getUserAnalytics();
const stats = await api.analytics.getDashboardStats();

// Rotation API
const settings = await api.rotation.getSettings();
const nextAgent = await api.rotation.getNextAgent("group-id");
```

## Custom Hooks

### File: `src/hooks/use-agents.ts`

#### React Hook untuk Agents

```typescript
import { useAgents } from "@/hooks/use-agents";

function AgentsList() {
  const {
    agents,
    loading,
    error,
    createAgent,
    updateAgent,
    deleteAgent,
    toggleAgentStatus,
  } = useAgents();

  const handleCreateAgent = async () => {
    const result = await createAgent({
      name: "New Agent",
      phoneNumber: "+6281234567890",
      weight: 1,
    });

    if (result.success) {
      console.log("Agent created:", result.data);
    } else {
      console.error("Error:", result.error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {agents.map((agent) => (
        <div key={agent.id}>
          {agent.name} - {agent.phoneNumber}
        </div>
      ))}
    </div>
  );
}
```

## Database Configuration

### File: `src/lib/db.ts`

#### Automatic Environment Selection

```typescript
import { db } from "@/lib/db";

// Database client otomatis menggunakan:
// - DATABASE_URL_DEV di development
// - DATABASE_URL di production
// - Fallback ke DATABASE_URL jika DATABASE_URL_DEV tidak ada

// Query logging otomatis di development
const agents = await db.agent.findMany();
```

## Authentication Configuration

### File: `src/lib/auth.ts`

#### Environment-based Configuration

```typescript
import { auth } from "@/lib/auth";

// Better Auth otomatis menggunakan:
// - config.auth.secret
// - config.auth.url
// - config.oauth.google.*
// - config.oauth.github.*
```

## Startup Configuration

### File: `src/lib/startup.ts`

#### Application Initialization

```typescript
import { initializeApp } from "@/lib/startup";

// Initialize app dengan environment validation
initializeApp();
```

## Best Practices

### 1. Environment Variables

- **Production**: Gunakan `DATABASE_URL`, `BETTER_AUTH_SECRET`
- **Development**: Gunakan `DATABASE_URL_DEV`, `BETTER_AUTH_SECRET`
- **Fallback**: Development fallback ke production env jika `_DEV` tidak ada
- **Validation**: Selalu validate environment di startup

### 2. API Calls

- **Use API Client**: Gunakan `apiClient` atau `api` wrapper
- **Error Handling**: Selalu handle error responses
- **Type Safety**: Gunakan TypeScript types untuk responses
- **Loading States**: Implement loading states di UI

### 3. Database

- **Environment Selection**: Database URL otomatis berdasarkan environment
- **Logging**: Query logging otomatis di development
- **Connection Pooling**: Prisma handle connection pooling

### 4. Authentication

- **Token Management**: Gunakan `setAuthToken` dan `removeAuthToken`
- **Auto Redirect**: 401 responses otomatis redirect ke login
- **Session Management**: Better Auth handle session management

## Error Handling

### API Errors

```typescript
const response = await apiClient.get("/agents");

if (!response.success) {
  // Handle error
  console.error("API Error:", response.error);
  console.error("Details:", response.details);
}
```

### Network Errors

```typescript
try {
  const response = await apiClient.post("/agents", data);
} catch (error) {
  // Network error atau timeout
  console.error("Network Error:", error);
}
```

### Environment Errors

```typescript
import { validateEnvironment } from "@/lib/env";

try {
  validateEnvironment();
} catch (error) {
  console.error("Environment Error:", error.message);
  process.exit(1);
}
```

## Migration Guide

### From Manual Environment to Config System

1. **Update Environment Variables**:

   ```env
   # Before
   DATABASE_URL=mongodb://localhost:27017/app

   # After
   DATABASE_URL=mongodb://localhost:27017/app
   DATABASE_URL_DEV=mongodb://localhost:27017/app-dev
   ```

2. **Update Imports**:

   ```typescript
   // Before
   const dbUrl = process.env.DATABASE_URL;

   // After
   import { getDatabaseUrl } from "@/lib/env";
   const dbUrl = getDatabaseUrl();
   ```

3. **Update API Calls**:

   ```typescript
   // Before
   const response = await fetch("/api/agents");

   // After
   import { apiClient } from "@/lib/axios";
   const response = await apiClient.get("/agents");
   ```

Sistem environment dan API client ini memberikan konfigurasi yang fleksibel, type safety yang lengkap, dan error handling yang robust untuk production dan development environment.
