import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/lib/models/Project";

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find().sort({ category: 1, order: 1 });
    return NextResponse.json({ success: true, projects });
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

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { title, category, vimeoUrl, order } = body;

    if (!title || !category || !vimeoUrl) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const project = await Project.create({
      title,
      category,
      vimeoUrl,
      order: order ?? 0,
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
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