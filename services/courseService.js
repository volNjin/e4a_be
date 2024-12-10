import { createCourseWithSection } from "../controllers/courseController.js";
import Course from "../models/Course.js";

class CourseService {
  // Get a list of all courses
  static async getAllCourses() {
    try {
      const courses = await Course.find().populate("teacher", "name email");
      return courses;
    } catch (error) {
      throw new Error("Failed to fetch courses");
    }
  }

  // Get details of a specific course by ID
  static async getCourseById(courseId) {
    try {
      const course = await Course.findById(courseId).populate(
        "teacher",
        "name email"
      );
      if (!course) throw new Error("Course not found");
      return course;
    } catch (error) {
      throw new Error("Failed to fetch course");
    }
  }

  static async createCourse(title, description, teacher) {
    try {
      if (!title || !description || !teacher) {
        return {
          success: false,
          status: 400,
          message: "All fields are required",
        };
      }

      const existingCourse = await Course.findOne({
        title,
        description,
        teacher,
      });
      if (existingCourse) {
        return {
          success: false,
          status: 400,
          message: "Course already created",
        };
      }

      const newCourse = new Course(title, description, teacher);
      await newCourse.save();
      return { success: true, course: newCourse };
    } catch (error) {
      throw error;
    }
  }
}

export default CourseService;
