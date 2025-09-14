/**
 * Environment configuration untuk production dan development
 * Menggunakan pattern DATABASE_URL untuk production dan DATABASE_URL_DEV untuk development
 */

// Helper function untuk mendapatkan environment variable dengan fallback
function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key];
  if (!value && fallback === undefined) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value || fallback || "";
}

// Helper function untuk mendapatkan boolean environment variable
function getBooleanEnvVar(key: string, fallback: boolean = false): boolean {
  const value = process.env[key];
  if (!value) return fallback;
  return value.toLowerCase() === "true";
}

// Helper function untuk mendapatkan number environment variable
function getNumberEnvVar(key: string, fallback: number): number {
  const value = process.env[key];
  if (!value) return fallback;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) return fallback;
  return parsed;
}

// Environment detection
export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";
export const isTest = process.env.NODE_ENV === "test";

// Database configuration
export const databaseConfig = {
  url: isDevelopment
    ? getEnvVar(
        "DATABASE_URL_DEV",
        getEnvVar(
          "DATABASE_URL",
          "mongodb://localhost:27017/whatsapp-rotator-dev"
        )
      )
    : getEnvVar("DATABASE_URL", "mongodb://localhost:27017/whatsapp-rotator"),
  // Fallback ke default MongoDB URL jika environment variable tidak ada
} as const;

// Better Auth configuration
export const authConfig = {
  secret: isDevelopment
    ? getEnvVar(
        "BETTER_AUTH_SECRET_DEV",
        getEnvVar("BETTER_AUTH_SECRET", "dev-secret-key-change-in-production")
      )
    : getEnvVar("BETTER_AUTH_SECRET", "dev-secret-key-change-in-production"),
  url: isDevelopment
    ? getEnvVar(
        "BETTER_AUTH_URL_DEV",
        getEnvVar("BETTER_AUTH_URL", "http://localhost:3000")
      )
    : getEnvVar("BETTER_AUTH_URL", "http://localhost:3000"),
} as const;

// OAuth providers configuration
export const oauthConfig = {
  google: {
    clientId: isDevelopment
      ? getEnvVar("GOOGLE_CLIENT_ID_DEV", getEnvVar("GOOGLE_CLIENT_ID", ""))
      : getEnvVar("GOOGLE_CLIENT_ID", ""),
    clientSecret: isDevelopment
      ? getEnvVar(
          "GOOGLE_CLIENT_SECRET_DEV",
          getEnvVar("GOOGLE_CLIENT_SECRET", "")
        )
      : getEnvVar("GOOGLE_CLIENT_SECRET", ""),
  },
  github: {
    clientId: isDevelopment
      ? getEnvVar("GITHUB_CLIENT_ID_DEV", getEnvVar("GITHUB_CLIENT_ID", ""))
      : getEnvVar("GITHUB_CLIENT_ID", ""),
    clientSecret: isDevelopment
      ? getEnvVar(
          "GITHUB_CLIENT_SECRET_DEV",
          getEnvVar("GITHUB_CLIENT_SECRET", "")
        )
      : getEnvVar("GITHUB_CLIENT_SECRET", ""),
  },
} as const;

// Next.js configuration
export const nextConfig = {
  appUrl: getEnvVar("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  apiUrl: getEnvVar("NEXT_PUBLIC_API_URL", "http://localhost:3000/api"),
} as const;

// API configuration
export const apiConfig = {
  baseUrl: getEnvVar("NEXT_PUBLIC_API_URL", "http://localhost:3000/api"),
  timeout: getNumberEnvVar("API_TIMEOUT", 30000), // 30 seconds default
  retryAttempts: getNumberEnvVar("API_RETRY_ATTEMPTS", 3),
  retryDelay: getNumberEnvVar("API_RETRY_DELAY", 1000), // 1 second
} as const;

// Logging configuration
export const loggingConfig = {
  level: getEnvVar("LOG_LEVEL", isDevelopment ? "debug" : "info"),
  enableConsole: getBooleanEnvVar("LOG_ENABLE_CONSOLE", isDevelopment),
  enableFile: getBooleanEnvVar("LOG_ENABLE_FILE", isProduction),
} as const;

// Security configuration
export const securityConfig = {
  corsOrigin: getEnvVar("CORS_ORIGIN", "*"),
  rateLimitWindow: getNumberEnvVar("RATE_LIMIT_WINDOW", 15 * 60 * 1000), // 15 minutes
  rateLimitMax: getNumberEnvVar("RATE_LIMIT_MAX", 100), // 100 requests per window
} as const;

// Feature flags
export const featureFlags = {
  enableAnalytics: getBooleanEnvVar("FEATURE_ANALYTICS", true),
  enableCaching: getBooleanEnvVar("FEATURE_CACHING", isProduction),
  enableRateLimit: getBooleanEnvVar("FEATURE_RATE_LIMIT", isProduction),
  enableDebugMode: getBooleanEnvVar("FEATURE_DEBUG_MODE", isDevelopment),
} as const;

// Export all configuration
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
} as const;

// Type untuk configuration
export type Config = typeof config;

// Validation function untuk memastikan semua required env vars ada
export function validateEnvironment(): void {
  // Di development, kita lebih permisif dengan fallback values
  if (isDevelopment) {
    console.log(
      "🔧 Development mode: Using fallback values for missing environment variables"
    );
    return;
  }

  // Di production, kita strict dengan required variables
  const requiredVars = ["BETTER_AUTH_SECRET", "DATABASE_URL"];

  const missingVars: string[] = [];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}\n` +
        `Please check your .env.local file and ensure all required variables are set.`
    );
  }
}

// Helper function untuk mendapatkan database URL yang tepat
export function getDatabaseUrl(): string {
  if (isDevelopment && process.env.DATABASE_URL_DEV) {
    return process.env.DATABASE_URL_DEV;
  }

  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Fallback ke default MongoDB URL
  const defaultUrl = isDevelopment
    ? "mongodb://localhost:27017/whatsapp-rotator-dev"
    : "mongodb://localhost:27017/whatsapp-rotator";

  console.warn(`⚠️ No database URL found, using default: ${defaultUrl}`);
  return defaultUrl;
}

// Helper function untuk mendapatkan API base URL
export function getApiBaseUrl(): string {
  return apiConfig.baseUrl;
}

// Helper function untuk mendapatkan app URL
export function getAppUrl(): string {
  return nextConfig.appUrl;
}

// Development helper untuk log environment info
export function logEnvironmentInfo(): void {
  if (isDevelopment && loggingConfig.enableConsole) {
    console.log("🔧 Environment Configuration:");
    console.log(`   Environment: ${process.env.NODE_ENV}`);
    console.log(
      `   Database URL: ${databaseConfig.url ? "✅ Set" : "❌ Missing"}`
    );
    console.log(
      `   Auth Secret: ${authConfig.secret ? "✅ Set" : "❌ Missing"}`
    );
    console.log(`   App URL: ${nextConfig.appUrl}`);
    console.log(`   API URL: ${apiConfig.baseUrl}`);
    console.log(
      `   Google OAuth: ${
        oauthConfig.google.clientId ? "✅ Set" : "❌ Missing"
      }`
    );
    console.log(
      `   GitHub OAuth: ${
        oauthConfig.github.clientId ? "✅ Set" : "❌ Missing"
      }`
    );
  }
}

// Export default config
export default config;
