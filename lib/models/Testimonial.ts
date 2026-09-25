import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  role?: string;
  company?: string;
  projectType: string;
  rating: number;
  text: string;
  email: string;
  avatarUrl?: string;
  verified: boolean;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, trim: true },
    company: { type: String, trim: true },
    projectType: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: {
      type: String,
      required: true,
      minlength: 20,
      maxlength: 500,
      trim: true,
    },
    email: { type: String, required: true, trim: true, lowercase: true },
    avatarUrl: { type: String },
    verified: { type: Boolean, default: false },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;