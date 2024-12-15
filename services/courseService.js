import Course from "../models/course.js";
import mongoose from "mongoose";
class CourseService {
  // 1️⃣ Get a list of all courses
  static async getAllCourses() {
    try {
      const courses = await Course.aggregate([
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
            totalSections: 1,
            totalEnrolledUsers: 1,
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
  static async createCourse(title, description, teacher) {
    try {
      // Check for required fields
      if (!title || !description || !teacher) {
        return {
          success: false,
          status: 400,
          message: "All fields are required",
        };
      }

      // Check if the course already exists
      const existingCourse = await Course.findOne({
        title: title,
        teacher: teacher,
      });

      if (existingCourse) {
        return {
          success: false,
          status: 400,
          message: "Course already created",
        };
      }
      const teacherId = new mongoose.Types.ObjectId(teacher)
      // Create and save new course
      const newCourse = new Course({
        title,
        description,
        teacher: teacherId,
        sections: [], // Default empty sections
        enrolledUsers: [], // Default empty enrolled users
      });

      await newCourse.save();
      return { success: true, course: newCourse };
    } catch (error) {
      throw new Error("Failed to create course");
    }
  }
}

export default CourseService;
