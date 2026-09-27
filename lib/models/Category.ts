import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  name: string;         // Display name: "Case Studies"
  slug: string;         // URL-safe: "case-studies" (unique)
  description?: string; // Subtitle
  shape: "vertical" | "horizontal"; // Video card shape
  order: number;        // Display order
  createdAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String, trim: true },
    shape: {
      type: String,
      required: true,
      enum: ["vertical", "horizontal"],
      default: "vertical",
    },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Category: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);

export default Category;