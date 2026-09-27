import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/lib/models/Category";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ success: true, categories });
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
    const { name, slug, description, shape, order } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Check for duplicate slug
    const existing = await Category.findOne({ slug: slug.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A category with this slug already exists" },
        { status: 400 }
      );
    }

    const category = await Category.create({
      name,
      slug: slug.toLowerCase().trim(),
      description: description || "",
      shape: shape || "vertical",
      order: order ?? 0,
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
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