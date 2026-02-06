import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/smart-waste";

// Schemas (inline for seeding)
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "admin" },
}, { timestamps: true });

const WasteBinSchema = new mongoose.Schema({
  binId: { type: String, unique: true },
  location: {
    address: String,
    latitude: Number,
    longitude: Number,
    area: String,
  },
  fillLevel: { type: Number, default: 0 },
  wasteType: { type: String, default: "general" },
  status: { type: String, default: "active" },
  capacity: { type: Number, default: 100 },
  lastCollected: { type: Date, default: Date.now },
  installDate: { type: Date, default: Date.now },
}, { timestamps: true });

const WasteHistorySchema = new mongoose.Schema({
  date: Date,
  totalCollected: Number,
  recyclable: Number,
  organic: Number,
  general: Number,
  hazardous: Number,
  recyclingRate: Number,
  collectionsCount: Number,
}, { timestamps: true });

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const User = mongoose.models.User || mongoose.model("User", UserSchema);
    const WasteBin = mongoose.models.WasteBin || mongoose.model("WasteBin", WasteBinSchema);
    const WasteHistory = mongoose.models.WasteHistory || mongoose.model("WasteHistory", WasteHistorySchema);

    // Clear existing data
    await User.deleteMany({});
    await WasteBin.deleteMany({});
    await WasteHistory.deleteMany({});
    console.log("Cleared existing data");

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);
    await User.create({
      name: "Admin User",
      email: "admin@smartwaste.com",
      password: hashedPassword,
      role: "admin",
    });
    console.log("Created admin user");

    // Create sample bins
    const areas = ["Downtown", "Uptown", "Midtown", "Suburb", "Industrial"];
    const wasteTypes = ["general", "recyclable", "organic", "hazardous"];
    const bins = [];

    for (let i = 1; i <= 20; i++) {
      bins.push({
        binId: `BIN-${String(i).padStart(4, "0")}`,
        location: {
          address: `${100 + i} Main Street`,
          latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
          longitude: -74.006 + (Math.random() - 0.5) * 0.1,
          area: areas[Math.floor(Math.random() * areas.length)],
        },
        fillLevel: Math.floor(Math.random() * 100),
        wasteType: wasteTypes[Math.floor(Math.random() * wasteTypes.length)],
        status: "active",
        capacity: 100,
        lastCollected: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      });
    }

    await WasteBin.insertMany(bins);
    console.log("Created 20 sample bins");

    // Create waste history
    const history = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      history.push({
        date,
        totalCollected: Math.floor(Math.random() * 500) + 200,
        recyclable: Math.floor(Math.random() * 150) + 50,
        organic: Math.floor(Math.random() * 100) + 30,
        general: Math.floor(Math.random() * 200) + 100,
        hazardous: Math.floor(Math.random() * 20),
        recyclingRate: Math.floor(Math.random() * 30) + 20,
        collectionsCount: Math.floor(Math.random() * 10) + 5,
      });
    }

    await WasteHistory.insertMany(history);
    console.log("Created 30 days of waste history");

    console.log("\n✅ Database seeded successfully!");
    console.log("\nAdmin credentials:");
    console.log("Email: admin@smartwaste.com");
    console.log("Password: admin123");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();