import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import WasteBin from "@/app/models/WasteBin";
import Alert from "@/app/models/Alert";
import { authenticateRequest } from "@/app/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const wasteType = searchParams.get("wasteType");
    const area = searchParams.get("area");

    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    if (wasteType) query.wasteType = wasteType;
    if (area) query["location.area"] = area;

    const bins = await WasteBin.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ bins });
  } catch (error) {
    console.error("Get bins error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = authenticateRequest(request);
    if (!payload || !["admin", "operator"].includes(payload.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const data = await request.json();

    const binCount = await WasteBin.countDocuments();
    const binId = `BIN-${String(binCount + 1).padStart(4, "0")}`;

    const bin = await WasteBin.create({
      ...data,
      binId,
    });

    return NextResponse.json(
      { message: "Bin created successfully", bin },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create bin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}