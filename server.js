// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import jobsRoutes from "./routes/jobs.js";
// import applicationsRoutes from "./routes/applications.js";
// import cors from "cors";
// import path from "path";

// dotenv.config();

// const app = express();

// // ===== CORS SETTINGS =====
// const allowedOrigins = [
//   "https://www.britishirishsocialworkagency.co.uk", // Frontend domain
//   "https://britishirishsocialworkagency.co.uk",     // Root domain (optional)
// ];


// app.use(cors({
//   origin: ["https://britishirishsocialworkagency.co.uk", "https://www.britishirishsocialworkagency.co.uk"],
//   methods: ["GET", "POST", "PUT", "DELETE"],
// }));

// // ===== MIDDLEWARE =====
// app.use(express.json());
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// // ===== ROUTES =====
// app.use("/api/jobs", jobsRoutes);
// app.use("/api/applications", applicationsRoutes);

// // ===== PORT =====
// const PORT = process.env.PORT || 5000;

// // ===== CONNECT TO MONGODB =====
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => {
//   console.log("✅ Successfully connected to MongoDB");
//   app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// })
// .catch((err) => {
//   console.error("❌ Failed to connect to MongoDB:", err);
// });

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jobsRoutes from "./routes/jobs.js";
import applicationsRoutes from "./routes/applications.js";
import cors from "cors";
import path from "path";
import fs from "fs";
import { Buffer } from "buffer";
import nodemailer from "nodemailer";

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

// ===== SMTP TRANSPORTER (Gmail) =====
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // your app password
  },
});

// ===== TRACKING PIXEL ROUTE =====
app.get("/track/:id.png", async (req, res) => {
  const emailId = req.params.id;
  const ip = req.ip;
  const userAgent = req.get("User-Agent");
  const timestamp = new Date().toISOString();

  // Log to local file
  const logLine = `${emailId}, ${timestamp}, ${ip}, ${userAgent}\n`;
  fs.appendFile("opens_log.txt", logLine, (err) => {
    if (err) console.error("Error logging email open:", err);
  });

  // Send notification email to yourself
  try {
    await transporter.sendMail({
      from: `"Email Tracker" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // send to yourself
      subject: `Email Opened: ${emailId}`,
      text: `Email ID: ${emailId}\nTime: ${timestamp}\nIP: ${ip}\nUser-Agent: ${userAgent}`,
    });
    console.log(`📧 Notification sent for ${emailId}`);
  } catch (error) {
    console.error(`❌ Failed to send notification for ${emailId}:`, error);
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