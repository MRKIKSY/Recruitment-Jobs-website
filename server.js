// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jobsRoutes from "./routes/jobs.js";
import applicationsRoutes from "./routes/applications.js";
import cors from "cors";
import path from "path";
import EmailOpen from "./models/EmailOpen.js"; // MongoDB model for opens
import { Buffer } from "buffer";

dotenv.config();

const app = express();

// ===== CORS SETTINGS =====
const allowedOrigins = [
  "https://www.britishirishsocialworkagency.co.uk",
  "https://britishirishsocialworkagency.co.uk",
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// ===== MIDDLEWARE =====
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ===== TRACKING PIXEL ROUTE =====
app.get("/track/:id.png", async (req, res) => {
  const emailId = req.params.id;
  const ip = req.ip;
  const userAgent = req.get("User-Agent");

  try {
    // Log email open in MongoDB
    await EmailOpen.create({
      emailId,
      ip,
      userAgent,
    });
    console.log(`📈 Logged open for ${emailId}`);
  } catch (err) {
    console.error("❌ Failed to log email open:", err);
  }

  // 1x1 transparent PNG
  const imgBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";
  const imgBuffer = Buffer.from(imgBase64, "base64");

  res.set("Content-Type", "image/png");
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.send(imgBuffer);
});

// ===== ROUTES =====
app.use("/api/jobs", jobsRoutes);
app.use("/api/applications", applicationsRoutes);

// ===== PORT =====
const PORT = process.env.PORT || 5000;

// ===== CONNECT TO MONGODB =====
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ Successfully connected to MongoDB");
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch((err) => {
  console.error("❌ Failed to connect to MongoDB:", err);
});