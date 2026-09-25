import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Testimonial from "@/lib/models/Testimonial";

// GET — by default returns only approved.
// Pass ?all=true to get everything (for admin, later secured)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const includeAll = searchParams.get("all") === "true";
    const ratingFilter = searchParams.get("rating");

    const query: Record<string, unknown> = includeAll
      ? {}
      : { approved: true };

    if (ratingFilter && ratingFilter !== "all") {
      const r = Number(ratingFilter);
      if (r >= 1 && r <= 5) {
        query.rating = r;
      }
    }

    const testimonials = await Testimonial.find(query).sort({
      createdAt: -1,
    });

    return NextResponse.json({ success: true, testimonials });
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

// POST — user submits a new review
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { name, email, text, rating, projectType } = body;

    if (!name || !email || !text || !rating || !projectType) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (text.length < 20) {
      return NextResponse.json(
        { success: false, error: "Review must be at least 20 characters" },
        { status: 400 }
      );
    }

    if (text.length > 500) {
      return NextResponse.json(
        { success: false, error: "Review must be under 500 characters" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const testimonial = await Testimonial.create({
      ...body,
      approved: false,
      verified: false,
    });

    return NextResponse.json(
      { success: true, testimonial },
      { status: 201 }
    );
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