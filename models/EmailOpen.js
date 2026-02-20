import mongoose from "mongoose";

const EmailOpenSchema = new mongoose.Schema({
  emailId: { type: String, required: true },       // Unique ID from tracking pixel
  timestamp: { type: Date, default: Date.now },    // When pixel was accessed
  ip: { type: String },                            // IP of client
  userAgent: { type: String },                     // Browser / email client
});

export default mongoose.model("EmailOpen", EmailOpenSchema);