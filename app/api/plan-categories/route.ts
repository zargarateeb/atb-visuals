import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import PlanCategory from "@/lib/models/PlanCategory";

export async function GET() {
  try {
    await connectDB();
    const categories = await PlanCategory.find({ active: true }).sort({
      order: 1,
    });
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