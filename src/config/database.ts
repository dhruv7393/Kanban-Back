import mongoose from "mongoose";
import { config } from "./environment.js";

interface DatabaseConfig {
  uri: string;
  options: mongoose.ConnectOptions;
}

export const connectDatabase = async (): Promise<void> => {
  try {
    if (
      !config.mongodbUri ||
      config.mongodbUri === "mongodb://localhost:27017/kanban"
    ) {
      console.warn(
        "⚠️ No valid MongoDB URI found, skipping database connection"
      );
      return;
    }

    const dbConfig: DatabaseConfig = {
      uri: config.mongodbUri,
      options: {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
      },
    };

    await mongoose.connect(dbConfig.uri, dbConfig.options);

    console.log("✅ MongoDB connected successfully");

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🔄 MongoDB reconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("📴 MongoDB connection closed through app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    console.warn("⚠️ Continuing without database connection");
    // Don't exit in production, just log the error
    if (process.env.NODE_ENV === "production") {
      console.warn("Application will continue with limited functionality");
    } else {
      process.exit(1);
    }
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log("📴 MongoDB connection closed");
  } catch (error) {
    console.error("❌ Error closing MongoDB connection:", error);
  }
};
