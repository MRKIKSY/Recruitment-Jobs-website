import express from "express";
import Application from "../models/Application.js";
import multer from "multer";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Multer config
const uploadFolder = path.join(process.cwd(), "uploads");
if(!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

const storage = multer.diskStorage({
  destination: (req,file,cb)=>cb(null, uploadFolder),
  filename: (req,file,cb)=> cb(null, Date.now()+"-"+file.originalname)
});

const upload = multer({
  storage,
  limits: {fileSize:5*1024*1024},
  fileFilter: (req,file,cb)=>{
    const allowedTypes = ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if(allowedTypes.includes(file.mimetype)) cb(null,true);
    else cb(new Error("Only PDF/DOC/DOCX allowed"));
  }
});

// Apply with CV
router.post("/", upload.single("cv"), async (req,res)=>{
  try{
    const {jobTitle, applicantName, applicantEmail, applicantPhone, applicantExperience} = req.body;

    if(!req.file) return res.status(400).json({success:false, message:"CV required"});

    const application = await Application.create({
      jobTitle, applicantName, applicantEmail, applicantPhone, applicantExperience,
      cvFile: req.file.filename
    });

    // Send email
    const transporter = nodemailer.createTransport({
      service:"gmail",
      auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from:process.env.EMAIL_USER,
      to:process.env.EMAIL_USER,
      subject:`New Application - ${jobTitle}`,
      text: `
Job: ${jobTitle}
Name: ${applicantName}
Email: ${applicantEmail}
Phone: ${applicantPhone}
Experience: ${applicantExperience}
      `,
      attachments:[{
        filename:req.file.originalname,
        path:path.join(uploadFolder, req.file.filename)
      }]
    });

    res.json({success:true, message:"Application submitted"});

  }catch(err){
    console.error(err);
    res.status(500).json({success:false, message:err.message});
  }
});

// Admin: Get all applications
router.get("/", async (req,res)=>{
  const apps = await Application.find().sort({createdAt:-1});
  res.json(apps);
});

export default router;

