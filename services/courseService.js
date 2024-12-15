import Course from "../models/course.js";
import mongoose from "mongoose";
class CourseService {
  // 1️⃣ Get a list of all courses
  static async getAllCourses(user) {
    try {
      let matchCondition = {};

      if (user.role === "admin") {
        matchCondition = {}; // Admin can see all courses
      } else if (user.role === "teacher") {
        matchCondition = { teacher: user.userId }; // Teacher sees only their courses
      } else if (user.role === "student") {
        matchCondition = { enrolledUsers: user.userId }; // Student sees only enrolled courses
      }

      const courses = await Course.aggregate([
        { $match: matchCondition },
        {
          $lookup: {
            from: "sections",
            localField: "sections",
            foreignField: "_id",
            as: "sections",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "enrolledUsers",
            foreignField: "_id",
            as: "enrolledUsers",
          },
        },
        {
          $addFields: {
            totalSections: { $size: "$sections" },
            totalEnrolledUsers: { $size: "$enrolledUsers" },
          },
        },
        {
          $project: {
            title: 1,
            description: 1,
            teacher: 1,
            totalSections: 1,
            totalEnrolledUsers: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ]);
      return courses;
    } catch (error) {
      console.error("Error getting all courses: ", error);
      throw new Error("Failed to get courses with stats");
    }
  }

  // 2️⃣ Get details of a specific course by ID
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

  // 3️⃣ Create a new course
  static async createCourse(title, description, teacherId) {
    try {
      // Check for required fields
      if (!title || !description || !teacherId) {
        return {
          success: false,
          status: 400,
          message: "All fields are required",
        };
      }
      const teacherObjectId = new mongoose.Types.ObjectId(teacherId);

      // Check if the course already exists
      const existingCourse = await Course.findOne({
        title,
        description,
        teacher: teacherObjectId,
      });

      if (existingCourse) {
        return {
          success: false,
          status: 400,
          message: "Course already created",
        };
      }
      // Create and save new course
      const newCourse = new Course({
        title,
        description,
        teacher: teacherObjectId,
        sections: [], // Default empty sections
        enrolledUsers: [], // Default empty enrolled users
      });

      await newCourse.save();
      return { success: true, course: newCourse };
    } catch (error) {
      throw error;
    }
  }
}

export default CourseService;
