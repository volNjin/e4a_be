import Course from "../models/course.js";

class CourseService {
  // Get a list of all courses
  static async getAllCourses() {
    try {
      const courses = await Course.aggregate([
        {
          $lookup: {
            from: "sections",
            localField: "_id",
            foreignField: "course",
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
      throw new Error("Failed to get courses with stats");
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
