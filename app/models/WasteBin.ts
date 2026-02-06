import mongoose, { Document, Schema } from "mongoose";

export interface IWasteBin extends Document {
  _id: mongoose.Types.ObjectId;
  binId: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
    area: string;
  };
  fillLevel: number;
  wasteType: "general" | "recyclable" | "organic" | "hazardous";
  status: "active" | "maintenance" | "inactive";
  capacity: number;
  lastCollected: Date;
  installDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WasteBinSchema = new Schema<IWasteBin>(
  {
    binId: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      address: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      area: { type: String, required: true },
    },
    fillLevel: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    wasteType: {
      type: String,
      enum: ["general", "recyclable", "organic", "hazardous"],
      default: "general",
    },
    status: {
      type: String,
      enum: ["active", "maintenance", "inactive"],
      default: "active",
    },
    capacity: {
      type: Number,
      default: 100,
    },
    lastCollected: {
      type: Date,
      default: Date.now,
    },
    installDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.WasteBin || mongoose.model<IWasteBin>("WasteBin", WasteBinSchema);