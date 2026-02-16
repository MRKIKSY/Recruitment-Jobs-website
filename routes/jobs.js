import express from "express";
import Job from "../models/Job.js";

const router = express.Router();

// Get all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    // 🔹 Add logging
    console.log("🔹 Jobs fetched from DB:", jobs);
    console.log("🔹 Number of jobs:", jobs.length);

    res.json(jobs);
  } catch (err) {
    console.error("❌ Error fetching jobs:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create job
router.post("/", async (req, res) => {
  try {
    const job = await Job.create(req.body);
    console.log("🔹 Job created:", job);
    res.json(job);
  } catch (err) {
    console.error("❌ Error creating job:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update job
router.put("/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    console.log("🔹 Job updated:", job);
    res.json(job);
  } catch (err) {
    console.error("❌ Error updating job:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete job
router.delete("/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    console.log("🔹 Job deleted:", req.params.id);
    res.json({ message: "Job deleted" });
  } catch (err) {
    console.error("❌ Error deleting job:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
