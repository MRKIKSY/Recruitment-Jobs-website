import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jobsRoutes from "./routes/jobs.js";
import applicationsRoutes from "./routes/applications.js";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/jobs", jobsRoutes);
app.use("/api/applications", applicationsRoutes);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ Successfully connected to MongoDB"); // MongoDB connection success
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`)); // Start server after DB connection
})
.catch((err) => {
  console.error("❌ Failed to connect to MongoDB:", err); // MongoDB connection error
});
