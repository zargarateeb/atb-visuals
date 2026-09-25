import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/lib/models/Project";

const SEED_DATA = [
  // SaaS
  {
    title: "SaaS Animation 1",
    category: "saas",
    vimeoUrl: "https://vimeo.com/1228138284",
    order: 0,
  },
  {
    title: "SaaS Animation 2",
    category: "saas",
    vimeoUrl: "https://vimeo.com/1228138717",
    order: 1,
  },
  // Podcast
  {
    title: "Podcast Edit 1",
    category: "podcast",
    vimeoUrl: "https://vimeo.com/1228140540",
    order: 0,
  },
  {
    title: "Podcast Edit 2",
    category: "podcast",
    vimeoUrl: "https://vimeo.com/1228146996",
    order: 1,
  },
  // Motion
  {
    title: "Motion Graphics 1",
    category: "motion",
    vimeoUrl: "https://vimeo.com/1228142171",
    order: 0,
  },
  {
    title: "Motion Graphics 2",
    category: "motion",
    vimeoUrl: "https://vimeo.com/1228141250",
    order: 1,
  },
  // Fast
  {
    title: "Fast-Paced Reel 1",
    category: "fast",
    vimeoUrl: "https://vimeo.com/1228143950",
    order: 0,
  },
  {
    title: "Fast-Paced Reel 2",
    category: "fast",
    vimeoUrl: "https://vimeo.com/1228143963",
    order: 1,
  },
];

export async function POST() {
  try {
    await connectDB();

    // Clear existing projects
    await Project.deleteMany({});

    // Insert seed data
    const projects = await Project.insertMany(SEED_DATA);

    return NextResponse.json({
      success: true,
      message: `Seeded ${projects.length} projects`,
      projects,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}