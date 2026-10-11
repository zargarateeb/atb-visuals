import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import PlanCategory from "@/lib/models/PlanCategory";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function GET() {
  try {
    await requireAuth();
    await connectDB();
    const categories = await PlanCategory.find({}).sort({ order: 1 });
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: msg },
      { status: msg === "Unauthorized" ? 401 : 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth();
    await connectDB();
    const body = await req.json();
    const created = await PlanCategory.create(body);
    return NextResponse.json({ success: true, category: created });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: msg },
      { status: msg === "Unauthorized" ? 401 : 500 }
    );
  }
}