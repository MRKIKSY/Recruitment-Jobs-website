import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  title: String,
  address: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Job", JobSchema);
