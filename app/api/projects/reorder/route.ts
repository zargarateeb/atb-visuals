import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/lib/models/Project";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { items } = body as {
      items: { id: string; order: number }[];
    };

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { success: false, error: "items must be an array" },
        { status: 400 }
      );
    }

    // Bulk update orders
    await Promise.all(
      items.map((item) =>
        Project.findByIdAndUpdate(item.id, { order: item.order })
      )
    );

    return NextResponse.json({ success: true, updated: items.length });
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