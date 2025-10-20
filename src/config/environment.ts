import dotenv from "dotenv";

// Load environment variables from .env file in development
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

// Parse CORS origins from environment variable
const parseCorsOrigins = (origins: string): string[] => {
  return origins.split(",").map((origin) => origin.trim());
};

// Get default CORS origins based on environment
const getDefaultCorsOrigins = (): string => {
  if (process.env.NODE_ENV === "production") {
    // In production, include common Amplify frontend patterns
    return "https://main.d1vg9d1h24p9v9.amplifyapp.com,https://*.amplifyapp.com";
  }
  return "http://localhost:5173,http://localhost:3000,http://localhost:5000";
};

export const config = {
  port: process.env.PORT || "3001",
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/kanban",
  corsOrigins: parseCorsOrigins(
    process.env.CORS_ORIGINS || getDefaultCorsOrigins()
  ),
  nodeEnv: process.env.NODE_ENV || "development",
};

// Validate required environment variables in production
export const validateEnvironment = (): void => {
  if (process.env.NODE_ENV === "production") {
    const requiredVars = ["MONGODB_URI"];
    const missingVars = requiredVars.filter((varName) => !process.env[varName]);
    
    // Check for CORS_ORIGINS - warn if not set but don't fail
    if (!process.env.CORS_ORIGINS) {
      console.warn("⚠️ CORS_ORIGINS not set, using default values");
      console.warn("   Default CORS origins:", config.corsOrigins.join(", "));
    }

    if (missingVars.length > 0) {
      console.error("❌ Missing required environment variables:", missingVars);
      console.error(
        "Please set these variables in AWS Amplify Console or your deployment environment"
      );
      // Don't exit in production, log warning instead
      console.warn("⚠️ Using fallback values for missing variables");
    }
  }
};

// Log current configuration (without sensitive data)
export const logConfiguration = (): void => {
  console.log("🔧 Current configuration:");
  console.log(`   - Environment: ${config.nodeEnv}`);
  console.log(`   - Port: ${config.port}`);
  console.log(`   - CORS Origins: ${config.corsOrigins.join(", ")}`);
  console.log(
    `   - MongoDB: ${config.mongodbUri ? "✅ Configured" : "❌ Not configured"}`
  );
};
