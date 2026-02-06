import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import User from "@/app/models/User";
import { authenticateRequest } from "@/app/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const payload = authenticateRequest(request);
    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(payload.userId).select("-password");
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}