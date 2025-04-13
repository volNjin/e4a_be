import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import sectionRoutes from "./routes/sectionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import ckRouter from "./routes/ckEditorRoute.js";
import progressRoutes from "./routes/progressRoutes.js";
import exerciseRoutes from "./routes/exerciseRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import translatorRoutes from "./routes/translatorRoutes.js";
dotenv.config(); // Load environment variables

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(
  cors({
    origin: "http://localhost:3000", // Chỉ cho phép frontend React từ localhost:3000
    methods: "GET, POST, PUT, DELETE", // Chỉ định các phương thức được phép
    allowedHeaders: ["Content-Type", "Authorization"], // Chỉ cho phép các header này
    credentials: true, // Cho phép gửi cookie hoặc thông tin xác thực (nếu cần)
  })
);

// public upload files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit with failure
  }
};

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ck-editor", ckRouter);
app.use("/api/user", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/translate", translatorRoutes);
// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
