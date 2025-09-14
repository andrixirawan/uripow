import { validateEnvironment, logEnvironmentInfo, config } from "./env";

/**
 * Startup configuration dan validation
 * Jalankan ini di awal aplikasi untuk memastikan environment sudah benar
 */

export function initializeApp(): void {
  try {
    // Validate environment variables
    validateEnvironment();

    // Log environment info di development
    if (config.env.isDevelopment) {
      logEnvironmentInfo();
    }

    console.log("✅ Application initialized successfully");
  } catch (error) {
    console.error("❌ Application initialization failed:", error);
    process.exit(1);
  }
}

// Auto-initialize jika di server side
if (typeof window === "undefined") {
  initializeApp();
}
