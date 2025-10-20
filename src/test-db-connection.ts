import mongoose from "mongoose";
import { connectDatabase } from "./config/database.js";
import { Project } from "./models/Project.js";

const testConnection = async () => {
  try {
    console.log("🔍 Testing database connection...");
    
    await connectDatabase();
    
    console.log("📊 Connection state:", mongoose.connection.readyState);
    console.log("📊 Connection states mapping:");
    console.log("  0 = disconnected");
    console.log("  1 = connected");
    console.log("  2 = connecting");
    console.log("  3 = disconnecting");
    
    console.log("🔍 Testing Project.find()...");
    const projects = await Project.find();
    console.log(`📊 Found ${projects.length} projects in database`);
    
    if (projects.length > 0) {
      console.log("🏗️  Project names:");
      projects.forEach((project, index) => {
        console.log(`  ${index + 1}. ${project.name}`);
      });
    }
    
    console.log("✅ Database test completed");
    
  } catch (error) {
    console.error("❌ Database test failed:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

testConnection();