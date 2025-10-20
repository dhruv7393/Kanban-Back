import mongoose from "mongoose";
import { config } from "./environment";

interface DatabaseConfig {
  uri: string;
  options: mongoose.ConnectOptions;
}

export const connectDatabase = async (): Promise<void> => {
  try {
    if (!config.mongodbUri) {
      console.warn("⚠️ No MongoDB URI found, skipping database connection");
      return;
    }

    console.log("🔗 Attempting to connect to MongoDB...");
    console.log("📊 MongoDB URI configured:", config.mongodbUri ? "Yes" : "No");

    // Set mongoose options globally to ensure they persist across reconnections
    mongoose.set('bufferCommands', false);

    const dbConfig: DatabaseConfig = {
      uri: config.mongodbUri,
      options: {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 30000, // Increased timeout
        socketTimeoutMS: 0, // Keep socket open indefinitely
        connectTimeoutMS: 30000,
        heartbeatFrequencyMS: 10000,
        bufferCommands: false,
        maxIdleTimeMS: 0, // Don't close connections due to inactivity
        retryWrites: true,
        retryReads: true,
        autoIndex: false, // Disable auto-index creation in production
        autoCreate: false, // Disable auto-collection creation
      },
    };

    await mongoose.connect(dbConfig.uri, dbConfig.options);

    console.log("✅ MongoDB connected successfully");
    console.log("📊 Connection state:", mongoose.connection.readyState);
    console.log("📊 Database name:", mongoose.connection.name);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
      // Don't close connection on error, let Mongoose handle reconnection
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected - attempting to reconnect...");
      // Mongoose will automatically attempt to reconnect
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🔄 MongoDB reconnected successfully");
    });

    mongoose.connection.on("connecting", () => {
      console.log("🔄 MongoDB connecting...");
    });

    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connected");
    });

    // Only close connection on explicit process termination
    process.on("SIGINT", async () => {
      console.log("🛑 Received SIGINT, closing MongoDB connection...");
      try {
        await mongoose.connection.close();
        console.log("📴 MongoDB connection closed gracefully");
      } catch (err) {
        console.error("❌ Error closing MongoDB connection:", err);
      }
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      console.log("🛑 Received SIGTERM, closing MongoDB connection...");
      try {
        await mongoose.connection.close();
        console.log("📴 MongoDB connection closed gracefully");
      } catch (err) {
        console.error("❌ Error closing MongoDB connection:", err);
      }
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
