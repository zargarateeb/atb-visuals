import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import PlanCategory from "@/lib/models/PlanCategory";

const SEED_CATEGORIES = [
  {
    slug: "reels-shorts",
    name: "Reels & Shorts",
    icon: "🎬",
    subtitle: "TikTok, IG Reels, YouTube Shorts",
    order: 1,
    tiers: [
      {
        tier: "basic" as const,
        name: "Basic Reel",
        startingPrice: 400,
        features: [
          "Up to 30 seconds",
          "1 revision round",
          "Basic captions",
          "Simple transitions",
          "Music sync",
          "4-5 day delivery",
        ],
        eligibleServices: [
          "Basic IG Reels",
          "YouTube Shorts",
          "Influencer Edits",
        ],
      },
      {
        tier: "advanced" as const,
        name: "Advanced Reel",
        startingPrice: 800,
        features: [
          "Up to 60 seconds",
          "3 revision rounds",
          "Advanced motion graphics",
          "Beat-matched editing",
          "Face/head tracking",
          "Custom sound design",
          "2-3 day delivery",
          "Cinematic color grading",
        ],
        eligibleServices: [
          "Fast-Paced Reels",
          "Hardcore Gym / Car Edits",
          "Gaming Montage",
        ],
      },
    ],
  },
  {
    slug: "podcast-edits",
    name: "Podcast Edits",
    icon: "🎙️",
    subtitle: "Multicam podcast post-production",
    order: 2,
    tiers: [
      {
        tier: "basic" as const,
        name: "Basic Podcast",
        startingPrice: 700,
        features: [
          "Up to 10 minutes final",
          "1 revision round",
          "Clean cuts",
          "Basic audio cleanup",
          "Simple lower thirds",
          "5-7 day delivery",
        ],
        eligibleServices: ["Podcast Edits"],
      },
      {
        tier: "advanced" as const,
        name: "Advanced Podcast",
        startingPrice: 1200,
        features: [
          "Up to 20 minutes final",
          "3 revision rounds",
          "Head-tracking graphics",
          "Dynamic zooms + cuts",
          "Custom sound design",
          "Animated lower thirds",
          "3-4 day delivery",
          "Color grading",
        ],
        eligibleServices: ["Podcast Edits", "Head-Tracking Edits"],
      },
    ],
  },
  {
    slug: "saas-motion",
    name: "SaaS & Motion Graphics",
    icon: "📊",
    subtitle: "Product explainers, UI animations, brand motion",
    order: 3,
    tiers: [
      {
        tier: "advanced" as const,
        name: "Advanced Motion",
        startingPrice: 1500,
        features: [
          "Up to 60 seconds",
          "3 revision rounds",
          "Custom motion graphics",
          "UI/UX animation",
          "Logo reveals",
          "Sound design",
          "3-5 day delivery",
          "Source files included",
        ],
        eligibleServices: ["SaaS Animation", "Motion Graphics"],
      },
    ],
  },
  {
    slug: "brand-content",
    name: "Brand Content",
    icon: "✨",
    subtitle: "Case studies, product showcases, advertisements",
    order: 4,
    tiers: [
      {
        tier: "basic" as const,
        name: "Basic Brand",
        startingPrice: 1000,
        features: [
          "Up to 60 seconds",
          "1 revision round",
          "Clean editing",
          "Basic motion graphics",
          "Music sync",
          "5-7 day delivery",
        ],
        eligibleServices: ["Case Study Edits"],
      },
      {
        tier: "advanced" as const,
        name: "Advanced Brand",
        startingPrice: 1800,
        features: [
          "Up to 90 seconds",
          "3 revision rounds",
          "Advanced motion graphics",
          "Custom sound design",
          "Cinematic color grading",
          "Full 3D elements",
          "3-5 day delivery",
          "Multi-format exports",
        ],
        eligibleServices: [
          "Brand/Product Showcase",
          "Advertisements",
        ],
      },
    ],
  },
  {
    slug: "custom",
    name: "Custom / Build Your Own",
    icon: "🛠️",
    subtitle: "Pick exactly what you need — live price calculator",
    order: 5,
    isCustom: true,
    tiers: [],
  },
];

export async function POST() {
  try {
    await connectDB();

    // Clear existing
    await PlanCategory.deleteMany({});

    // Insert seeds
    const categories = await PlanCategory.insertMany(SEED_CATEGORIES);

    return NextResponse.json({
      success: true,
      message: `Seeded ${categories.length} categories`,
      categories,
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