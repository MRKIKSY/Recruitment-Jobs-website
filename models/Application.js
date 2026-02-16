import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  jobTitle: String,
  applicantName: String,
  applicantEmail: String,
  applicantPhone: String,
  applicantExperience: String,
  cvFile: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Application", ApplicationSchema);
