import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPlanTier {
  tier: "basic" | "advanced";
  name: string; // e.g. "Basic Reel", "Advanced Reel"
  startingPrice: number;
  features: string[];
  eligibleServices: string[]; // services from this category that fit this tier
}

export interface IPlanCategory extends Document {
  slug: string; // unique, e.g. "reels-shorts"
  name: string; // display: "Reels & Shorts"
  icon: string; // emoji
  subtitle: string;
  order: number;
  active: boolean;
  tiers: IPlanTier[];
  isCustom?: boolean; // true only for the Custom category
  createdAt: Date;
  updatedAt: Date;
}

const TierSchema = new Schema<IPlanTier>(
  {
    tier: {
      type: String,
      enum: ["basic", "advanced"],
      required: true,
    },
    name: { type: String, required: true },
    startingPrice: { type: Number, required: true },
    features: [{ type: String }],
    eligibleServices: [{ type: String }],
  },
  { _id: false }
);

const PlanCategorySchema = new Schema<IPlanCategory>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    icon: { type: String, default: "💼" },
    subtitle: { type: String, required: true },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    tiers: [TierSchema],
    isCustom: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const PlanCategory: Model<IPlanCategory> =
  mongoose.models.PlanCategory ||
  mongoose.model<IPlanCategory>("PlanCategory", PlanCategorySchema);

export default PlanCategory;