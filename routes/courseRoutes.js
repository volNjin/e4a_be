import express from "express";
import {
  getAllCourses,
  getMyCourses,
  getCourseById,
  getEnrolledUsers,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";
import authenticate from "../middlewares/authMiddleware.js";

const courseRoutes = express.Router();
courseRoutes.use(authenticate);
// GET /api/courses - Get all courses
courseRoutes.get("/", getAllCourses);

// GET /api/courses/myCourses - Get all user's courses
courseRoutes.get("/my-courses", getMyCourses);

// GET /api/courses/:id - Get a single course by ID
courseRoutes.get("/:id", getCourseById);

courseRoutes.get("/enroll-users/:courseId", getEnrolledUsers);

// POST /api/courses - Create a new course
courseRoutes.post("/", createCourse);

courseRoutes.put("/:courseId", updateCourse);

courseRoutes.delete("/:id", deleteCourse);

export default courseRoutes;
