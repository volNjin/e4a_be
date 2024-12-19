import express from "express";
import {
  getAllCourses,
  getMyCourses,
  getCourseById,
  createCourse,
  deleteCourse,
  getEnrolledUsers,
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

// POST /api/courses - Create a new course
courseRoutes.post("/", createCourse);
courseRoutes.delete("/:id", deleteCourse);
courseRoutes.get("/enroll-users/:courseId", getEnrolledUsers);

export default courseRoutes;
