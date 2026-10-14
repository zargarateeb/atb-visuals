import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import PlanCategory from "@/lib/models/PlanCategory";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const updated = await PlanCategory.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!updated)
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    return NextResponse.json({ success: true, category: updated });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: msg },
      { status: msg === "Unauthorized" ? 401 : 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    await connectDB();
    const { id } = await params;
    await PlanCategory.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: msg },
      { status: msg === "Unauthorized" ? 401 : 500 }
    );
  }
}