import express from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
} from "../controllers/courseController.js";
import authenticate from "../middlewares/authMiddleware.js";

const courseRoutes = express.Router();
courseRoutes.use(authenticate);
// GET /api/courses - Get all courses
courseRoutes.get("/", getAllCourses);

// GET /api/courses/:id - Get a single course by ID
courseRoutes.get("/:id", getCourseById);

// POST /api/courses - Create a new course
courseRoutes.post("/", createCourse);

export default courseRoutes;
