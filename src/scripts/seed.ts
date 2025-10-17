import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";

// Load environment variables
dotenv.config();

const seedProjects = [
  {
    name: "Website Redesign",
    description:
      "Complete overhaul of the company website with modern design and improved UX",
    color: "#3B82F6",
  },
  {
    name: "Mobile App Development",
    description:
      "Build a cross-platform mobile application for iOS and Android",
    color: "#10B981",
  },
  {
    name: "API Integration",
    description: "Integrate third-party APIs for enhanced functionality",
    color: "#F59E0B",
  },
];

const seedTasks = [
  {
    title: "Design wireframes",
    description:
      "Create detailed wireframes for all pages including desktop and mobile views",
    status: "done",
    priority: "high",
    dueDate: new Date("2024-12-01"),
    project_index: 0,
  },
  {
    title: "Implement header component",
    description:
      "Build responsive header with navigation menu and search functionality",
    status: "todo",
    priority: "medium",
    dueDate: new Date("2024-12-15"),
    project_index: 0,
  },
  {
    title: "Set up authentication",
    description: "Implement user authentication system with JWT tokens",
    status: "blocked",
    priority: "high",
    dueDate: new Date("2024-12-20"),
    blockedReason: "Waiting for security team approval",
    project_index: 1,
  },
  {
    title: "Design app icons",
    description: "Create app icons for both iOS and Android platforms",
    status: "backlog",
    priority: "low",
    dueDate: new Date("2024-12-25"),
    project_index: 1,
  },
  {
    title: "Research payment APIs",
    description: "Research and compare different payment gateway APIs",
    status: "todo",
    priority: "medium",
    dueDate: new Date("2024-12-18"),
    project_index: 2,
  },
];

const seedDatabase = async (): Promise<void> => {
  try {
    console.log("🌱 Starting database seeding...");

    // Connect to database
    await connectDatabase();

    // Clear existing data
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Insert projects
    const createdProjects = await Project.insertMany(seedProjects);
    console.log(`✅ Created ${createdProjects.length} projects`);

    // Insert tasks with correct project references
    const tasksWithProjectIds = seedTasks.map((task) => ({
      ...task,
      project_id: createdProjects[task.project_index]._id,
      project_index: undefined, // Remove the temporary index
    }));

    const createdTasks = await Task.insertMany(tasksWithProjectIds);
    console.log(`✅ Created ${createdTasks.length} tasks`);

    console.log("🎉 Database seeding completed successfully!");

    // Display summary
    console.log("\n📊 Seeding Summary:");
    console.log(`Projects: ${createdProjects.length}`);
    console.log(`Tasks: ${createdTasks.length}`);

    console.log("\n🏗️  Projects created:");
    createdProjects.forEach((project, index) => {
      console.log(`  ${index + 1}. ${project.name} (${project.color})`);
    });

    console.log("\n📋 Tasks created:");
    createdTasks.forEach((task, index) => {
      console.log(
        `  ${index + 1}. ${task.title} [${task.status}] - ${
          task.priority
        } priority`
      );
    });
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
    process.exit(0);
  }
};

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export { seedDatabase };
