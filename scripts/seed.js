const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();


const MONGODB_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/smart-waste";

// Schemas
const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "admin" },
  },
  { timestamps: true }
);

const WasteBinSchema = new mongoose.Schema(
  {
    binId: { type: String, unique: true },
    location: {
      address: String,
      latitude: Number,
      longitude: Number,
      area: String,
    },
    fillLevel: Number,
    wasteType: String,
    status: String,
    capacity: Number,
    lastCollected: Date,
    installDate: Date,
  },
  { timestamps: true }
);

const WasteHistorySchema = new mongoose.Schema(
  {
    date: Date,
    totalCollected: Number,
    recyclable: Number,
    organic: Number,
    general: Number,
    hazardous: Number,
    recyclingRate: Number,
    collectionsCount: Number,
  },
  { timestamps: true }
);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected");

    const User =
      mongoose.models.User || mongoose.model("User", UserSchema);
    const WasteBin =
      mongoose.models.WasteBin || mongoose.model("WasteBin", WasteBinSchema);
    const WasteHistory =
      mongoose.models.WasteHistory ||
      mongoose.model("WasteHistory", WasteHistorySchema);

    await User.deleteMany({});
    await WasteBin.deleteMany({});
    await WasteHistory.deleteMany({});

    const hashedPassword = await bcrypt.hash("admin123", 12);

    await User.create({
      name: "Admin User",
      email: "admin@smartwaste.com",
      password: hashedPassword,
      role: "admin",
    });

    const areas = ["Downtown", "Uptown", "Midtown", "Suburb", "Industrial"];
    const wasteTypes = ["general", "recyclable", "organic", "hazardous"];

    const bins = Array.from({ length: 20 }).map((_, i) => ({
      binId: `BIN-${String(i + 1).padStart(4, "0")}`,
      location: {
        address: `${100 + i} Main Street`,
        latitude: 40.7 + Math.random() * 0.1,
        longitude: -74 + Math.random() * 0.1,
        area: areas[Math.floor(Math.random() * areas.length)],
      },
      fillLevel: Math.floor(Math.random() * 100),
      wasteType: wasteTypes[Math.floor(Math.random() * wasteTypes.length)],
      status: "active",
      capacity: 100,
      lastCollected: new Date(),
      installDate: new Date(),
    }));

    await WasteBin.insertMany(bins);

    const history = Array.from({ length: 30 }).map((_, i) => ({
      date: new Date(Date.now() - i * 86400000),
      totalCollected: Math.floor(Math.random() * 500) + 200,
      recyclable: Math.floor(Math.random() * 150),
      organic: Math.floor(Math.random() * 100),
      general: Math.floor(Math.random() * 200),
      hazardous: Math.floor(Math.random() * 20),
      recyclingRate: Math.floor(Math.random() * 30) + 20,
      collectionsCount: Math.floor(Math.random() * 10) + 5,
    }));

    await WasteHistory.insertMany(history);

    console.log("✅ Database seeded successfully");
    console.log("Admin: admin@smartwaste.com / admin123");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
