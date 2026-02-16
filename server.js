import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jobsRoutes from "./routes/jobs.js";
import applicationsRoutes from "./routes/applications.js";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();

// ===== CORS SETTINGS =====
const allowedOrigins = [
  "https://www.britishirishsocialworkagency.co.uk", // Frontend domain
  "https://britishirishsocialworkagency.co.uk",     // Root domain (optional)
];


app.use(cors({
  origin: ["https://britishirishsocialworkagency.co.uk", "https://www.britishirishsocialworkagency.co.uk"],
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// ===== MIDDLEWARE =====
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

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
