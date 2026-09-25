import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInquiry extends Document {
  name: string;
  email: string;
  phone?: string;
  brand?: string;
  projectType: string;
  budget?: string;
  timeline?: string;
  length?: string;
  foundVia?: string;
  contactPref?: string;
  footageReady?: string;
  references?: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    brand: { type: String },
    projectType: { type: String, required: true },
    budget: { type: String },
    timeline: { type: String },
    length: { type: String },
    foundVia: { type: String },
    contactPref: { type: String },
    footageReady: { type: String },
    references: { type: String },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry ||
  mongoose.model<IInquiry>("Inquiry", InquirySchema);

export default Inquiry;