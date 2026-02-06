import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import WasteBin from "@/app/models/WasteBin";
import Alert from "@/app/models/Alert";
import { authenticateRequest } from "@/app/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const bin = await WasteBin.findById(id);
    if (!bin) {
      return NextResponse.json(
        { error: "Bin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ bin });
  } catch (error) {
    console.error("Get bin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = authenticateRequest(request);
    if (!payload || !["admin", "operator"].includes(payload.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;
    const data = await request.json();

    const bin = await WasteBin.findByIdAndUpdate(
      id,
      { ...data },
      { new: true, runValidators: true }
    );

    if (!bin) {
      return NextResponse.json(
        { error: "Bin not found" },
        { status: 404 }
      );
    }

    // Create alert if fill level exceeds 80%
    if (data.fillLevel && data.fillLevel >= 80) {
      const existingAlert = await Alert.findOne({
        binId: bin._id,
        status: "active",
        type: "overflow",
      });

      if (!existingAlert) {
        const priority = data.fillLevel >= 95 ? "critical" : data.fillLevel >= 90 ? "high" : "medium";
        await Alert.create({
          binId: bin._id,
          binCode: bin.binId,
          message: `Bin ${bin.binId} is ${data.fillLevel}% full and requires collection`,
          priority,
          type: "overflow",
        });
      }
    }

    return NextResponse.json({ message: "Bin updated successfully", bin });
  } catch (error) {
    console.error("Update bin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = authenticateRequest(request);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;

    const bin = await WasteBin.findByIdAndDelete(id);
    if (!bin) {
      return NextResponse.json(
        { error: "Bin not found" },
        { status: 404 }
      );
    }

    // Delete associated alerts
    await Alert.deleteMany({ binId: id });

    return NextResponse.json({ message: "Bin deleted successfully" });
  } catch (error) {
    console.error("Delete bin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}