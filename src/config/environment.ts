import dotenv from "dotenv";

// Load environment variables from .env file in development
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

export const config = {
  port: process.env.PORT || "3001",
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/kanban",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  nodeEnv: process.env.NODE_ENV || "development",
};

// Validate required environment variables in production
export const validateEnvironment = (): void => {
  if (process.env.NODE_ENV === "production") {
    const requiredVars = ["MONGODB_URI"];
    const missingVars = requiredVars.filter((varName) => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error("❌ Missing required environment variables:", missingVars);
      console.error("Please set these variables in AWS Amplify Console or your deployment environment");
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
  console.log(`   - CORS Origin: ${config.corsOrigin}`);
  console.log(`   - MongoDB: ${config.mongodbUri ? "✅ Configured" : "❌ Not configured"}`);
};