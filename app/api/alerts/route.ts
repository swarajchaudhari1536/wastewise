import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import Alert from "@/app/models/Alert";
import { authenticateRequest } from "@/app/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const limit = parseInt(searchParams.get("limit") || "50");

    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("binId", "binId location");

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error("Get alerts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = authenticateRequest(request);
    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { alertId, status } = await request.json();

    const alert = await Alert.findByIdAndUpdate(
      alertId,
      { status },
      { new: true }
    );

    if (!alert) {
      return NextResponse.json(
        { error: "Alert not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Alert updated", alert });
  } catch (error) {
    console.error("Update alert error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}