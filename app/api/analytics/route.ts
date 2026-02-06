import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import WasteBin from "@/app/models/WasteBin";
import Alert from "@/app/models/Alert";
import WasteHistory from "@/app/models/WasteHistory";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "week";

    // Get bin statistics
    const totalBins = await WasteBin.countDocuments();
    const activeBins = await WasteBin.countDocuments({ status: "active" });
    const fullBins = await WasteBin.countDocuments({ fillLevel: { $gte: 80 } });
    const halfBins = await WasteBin.countDocuments({
      fillLevel: { $gte: 40, $lt: 80 },
    });
    const emptyBins = await WasteBin.countDocuments({ fillLevel: { $lt: 40 } });

    // Get bins by type
    const binsByType = await WasteBin.aggregate([
      { $group: { _id: "$wasteType", count: { $sum: 1 } } },
    ]);

    // Get active alerts
    const activeAlerts = await Alert.countDocuments({ status: "active" });
    const criticalAlerts = await Alert.countDocuments({
      status: "active",
      priority: "critical",
    });

    // Get waste history
    const days = period === "week" ? 7 : period === "month" ? 30 : 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const wasteHistory = await WasteHistory.find({
      date: { $gte: startDate },
    }).sort({ date: 1 });

    // Calculate totals
    const totalWasteCollected = wasteHistory.reduce(
      (sum, h) => sum + h.totalCollected,
      0
    );
    const totalRecyclable = wasteHistory.reduce(
      (sum, h) => sum + h.recyclable,
      0
    );
    const averageRecyclingRate =
      wasteHistory.length > 0
        ? wasteHistory.reduce((sum, h) => sum + h.recyclingRate, 0) /
          wasteHistory.length
        : 0;

    // Get area statistics
    const areaStats = await WasteBin.aggregate([
      {
        $group: {
          _id: "$location.area",
          totalBins: { $sum: 1 },
          avgFillLevel: { $avg: "$fillLevel" },
        },
      },
      { $sort: { avgFillLevel: -1 } },
    ]);

    return NextResponse.json({
      overview: {
        totalBins,
        activeBins,
        fullBins,
        halfBins,
        emptyBins,
        activeAlerts,
        criticalAlerts,
      },
      binsByType: binsByType.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {} as Record<string, number>),
      wasteStats: {
        totalCollected: totalWasteCollected,
        totalRecyclable,
        recyclingRate: Math.round(averageRecyclingRate),
      },
      wasteHistory: wasteHistory.map((h) => ({
        date: h.date,
        total: h.totalCollected,
        recyclable: h.recyclable,
        organic: h.organic,
        general: h.general,
        hazardous: h.hazardous,
        recyclingRate: h.recyclingRate,
      })),
      areaStats,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}