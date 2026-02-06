import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import WasteBin from "@/app/models/WasteBin";
import Alert from "@/app/models/Alert";
import WasteHistory from "@/app/models/WasteHistory";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { mode } = await request.json();

    const bins = await WasteBin.find({ status: "active" });

    const updates = await Promise.all(
      bins.map(async (bin) => {
        let newFillLevel: number;

        if (mode === "random") {
          const change = Math.floor(Math.random() * 20) - 5;
          newFillLevel = Math.max(0, Math.min(100, bin.fillLevel + change));
        } else if (mode === "increase") {
          newFillLevel = Math.min(100, bin.fillLevel + Math.floor(Math.random() * 15) + 5);
        } else if (mode === "reset") {
          newFillLevel = Math.floor(Math.random() * 20);
        } else {
          newFillLevel = bin.fillLevel;
        }

        bin.fillLevel = newFillLevel;
        await bin.save();

        // Create alert if needed
        if (newFillLevel >= 80) {
          const existingAlert = await Alert.findOne({
            binId: bin._id,
            status: "active",
            type: "overflow",
          });

          if (!existingAlert) {
            const priority = newFillLevel >= 95 ? "critical" : newFillLevel >= 90 ? "high" : "medium";
            await Alert.create({
              binId: bin._id,
              binCode: bin.binId,
              message: `Bin ${bin.binId} is ${newFillLevel}% full and requires collection`,
              priority,
              type: "overflow",
            });
          }
        }

        return bin;
      })
    );

    // Log to waste history
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const recyclableBins = bins.filter((b) => b.wasteType === "recyclable");
    const organicBins = bins.filter((b) => b.wasteType === "organic");
    const generalBins = bins.filter((b) => b.wasteType === "general");
    const hazardousBins = bins.filter((b) => b.wasteType === "hazardous");

    await WasteHistory.findOneAndUpdate(
      { date: today },
      {
        $inc: {
          totalCollected: Math.floor(Math.random() * 50) + 10,
          recyclable: Math.floor(Math.random() * 20) + 5,
          organic: Math.floor(Math.random() * 15) + 3,
          general: Math.floor(Math.random() * 25) + 8,
          hazardous: Math.floor(Math.random() * 5),
          collectionsCount: 1,
        },
        $set: {
          recyclingRate: Math.floor(Math.random() * 30) + 25,
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      message: "Simulation completed",
      updatedBins: updates.length,
    });
  } catch (error) {
    console.error("Simulation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}