import Course from "../models/Course.js";
import mongoose from "mongoose";
import Section from "../models/Section.js";
import cloudinaryService from "./cloudinaryService.js";

const imageFolder = "course-thumbnails";
class courseService {
  static async courseAggregate(matchCondition) {
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
          from: "users", // Lookup for enrolled users
          localField: "enrolledUsers",
          foreignField: "_id",
          as: "enrolledUsers",
        },
      },
      {
        $lookup: {
          from: "users", // Lookup for teacher information
          localField: "teacher",
          foreignField: "_id",
          as: "teacherInfo", // Join teacher's information
        },
      },
      {
        $addFields: {
          totalSections: { $size: "$sections" },
          totalEnrolledUsers: { $size: "$enrolledUsers" },
          teacher: { $arrayElemAt: ["$teacherInfo.name", 0] }, // Get only teacher's name
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          image: 1,
          teacher: 1, // Now the teacher field contains only the name
          totalSections: 1,
          enrolledUsers: { _id: 1, name: 1 },
          totalEnrolledUsers: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    return courses;
  }
  // 1️⃣ Get a list of all courses
  static async getAllCourses() {
    try {
      return await this.courseAggregate({});
    } catch (error) {
      console.error("Error getting all courses: ", error);
      throw new Error("Failed to get courses with stats");
    }
  }
  static async getCoursesByUser(user) {
    try {
      let matchCondition = {};
      console.log(user.id);
      const userId = new mongoose.Types.ObjectId(user.id);
      if (user.role === "teacher") {
        matchCondition = { teacher: userId }; // Teacher sees only their courses
      } else if (user.role === "student") {
        matchCondition = { enrolledUsers: userId }; // Student sees only enrolled courses
      }
      return await this.courseAggregate(matchCondition);
    } catch (error) {
      console.error("Error getting all courses: ", error);
      throw new Error("Failed to get courses with stats");
    }
  }

  static async getAllCoursesWithCheckEnrolled(userId) {
    try {
      const allCourses = await this.courseAggregate({});
      const updatedCourses = allCourses.map((course) => {
        const isEnrolled = course.enrolledUsers.some(
          (user) => user._id.toString() === userId
        );
        return {
          ...course,
          isEnrolled,
        };
      });
      return updatedCourses;
    } catch (error) {
      throw error;
    }
  }

  // Get details of a specific course by ID
  static async getCourseById(courseId) {
    try {
      const course = await Course.findById(courseId).populate(
        "teacher",
        "name email"
      );
      if (!course) return { message: "Course not found" };
      return course;
    } catch (error) {
      throw new Error("Failed to fetch course");
    }
  }

  static async getEnrolledUsers(courseId) {
    try {
      // Step 1: Find the course by its ID and get the enrolledUsers list
      const course = await Course.findById(courseId).populate(
        "enrolledUsers",
        "name email avatar"
      );

      if (!course) {
        return { success: false, status: 404, message: "Course not found" };
      }

      // Step 2: Return the list of enrolled users
      const enrolledUsers = course.enrolledUsers;

      return { success: true, data: enrolledUsers };
    } catch (error) {
      console.error("Error fetching enrolled users:", error);
      throw new Error("Failed to fetch enrolled users");
    }
  }

  // 3️⃣ Create a new course
  static async createCourse(title, description, image, teacherId) {
    try {
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
      const uploadedImage = await cloudinaryService.uploadImageToCloudinary(
        image,
        imageFolder
      );
      // Create and save new course
      const newCourse = new Course({
        title,
        description,
        image: uploadedImage.url,
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

  static async updateCourse(courseId, title, description, image) {
    try {
      const course = await Course.findById(courseId);
      if (!course) {
        return { success: false, status: 404, message: "Course not found" };
      }
      if (course.image) {
        await cloudinaryService.deleteImageFromCloudinary(course.image);
      }

      const uploadedImage = await cloudinaryService.uploadImageToCloudinary(
        image,
        imageFolder
      );
      // Update the course
      course.title = title;
      course.description = description;
      course.image = uploadedImage.url;
      await course.save();

      if (!course) {
        return { success: false, status: 404, message: "Course not found" };
      }

      return { success: true, course };
    } catch (error) {
      throw error;
    }
    s;
  }

  static async deleteCourse(courseId) {
    try {
      const course = await Course.findByIdAndDelete(courseId);
      await cloudinaryService.deleteImageFromCloudinary(course.image);
      if (!course) {
        return { success: false, status: 404, message: "Course not found" };
      }
      await Section.deleteMany({ course: courseId });
      // Remove this course from users' `enrolledCourses` array
      await User.updateMany(
        { enrolledCourses: courseId },
        { $pull: { enrolledCourses: courseId } }
      );
      return { success: true, message: "Course deleted successfully" };
    } catch (error) {
      throw error;
    }
  }
}

export default courseService;
