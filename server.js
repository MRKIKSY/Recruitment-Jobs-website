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
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // Allow requests from Postman / server-side
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS policy: The origin ${origin} is not allowed`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Allow all CRUD methods
  allowedHeaders: ["Content-Type", "Authorization"],             // Headers your frontend sends
  credentials: true,                                              // Needed for cookies/auth
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
