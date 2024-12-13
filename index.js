// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import authRoutes from "./routes/auth.js";
// import compression from "compression";
// import morgan from "morgan";
// import helmet from "helmet";
// dotenv.config(); // Load environment variables

// const app = express();

// // Middleware
// app.use(morgan("dev"));
// app.use(helmet());
// app.use(compression());
// app.use(express.json());
// app.use(cors());
// app.use(express.urlencoded({ extended: true }));

// // Database Connection
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//     process.exit(1); // Exit with failure
//   }
// };

// // Routes
// app.use("/api/auth", authRoutes);

// // Default Route
// app.get("/", (req, res) => {
//   res.send("Welcome to the API");
// });

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, async () => {
//   await connectDB();
//   console.log(`Server running on port ${PORT}`);
// });
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import sectionRoutes from "./routes/sectionRoutes.js";
dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS for frontend integration

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
app.use("/api/courses", courseRoutes);
app.use("/api/sections", sectionRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
