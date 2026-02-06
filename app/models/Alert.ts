import mongoose, { Document, Schema } from "mongoose";

export interface IAlert extends Document {
  _id: mongoose.Types.ObjectId;
  binId: mongoose.Types.ObjectId;
  binCode: string;
  message: string;
  priority: "low" | "medium" | "high" | "critical";
  type: "overflow" | "maintenance" | "collection" | "system";
  status: "active" | "acknowledged" | "resolved";
  createdAt: Date;
  updatedAt: Date;
}

const AlertSchema = new Schema<IAlert>(
  {
    binId: {
      type: Schema.Types.ObjectId,
      ref: "WasteBin",
      required: true,
    },
    binCode: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    type: {
      type: String,
      enum: ["overflow", "maintenance", "collection", "system"],
      default: "overflow",
    },
    status: {
      type: String,
      enum: ["active", "acknowledged", "resolved"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Alert || mongoose.model<IAlert>("Alert", AlertSchema);