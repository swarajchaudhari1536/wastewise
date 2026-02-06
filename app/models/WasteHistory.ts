import mongoose, { Document, Schema } from "mongoose";

export interface IWasteHistory extends Document {
  _id: mongoose.Types.ObjectId;
  date: Date;
  totalCollected: number;
  recyclable: number;
  organic: number;
  general: number;
  hazardous: number;
  recyclingRate: number;
  collectionsCount: number;
  area?: string;
  createdAt: Date;
}

const WasteHistorySchema = new Schema<IWasteHistory>(
  {
    date: {
      type: Date,
      required: true,
    },
    totalCollected: {
      type: Number,
      default: 0,
    },
    recyclable: {
      type: Number,
      default: 0,
    },
    organic: {
      type: Number,
      default: 0,
    },
    general: {
      type: Number,
      default: 0,
    },
    hazardous: {
      type: Number,
      default: 0,
    },
    recyclingRate: {
      type: Number,
      default: 0,
    },
    collectionsCount: {
      type: Number,
      default: 0,
    },
    area: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.WasteHistory || mongoose.model<IWasteHistory>("WasteHistory", WasteHistorySchema);