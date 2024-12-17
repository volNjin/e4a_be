import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // 🔐 Your email
    pass: process.env.EMAIL_PASSWORD, // 🔐 Your email password (use an App Password if using Gmail)
  },
});

export default transporter;
