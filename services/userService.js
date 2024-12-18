import User from "../models/user.js";
import Course from "../models/course.js";
import { getInfoData } from "../utils/index.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../helpers/randomToken.js";

const select = ["name", "email", "avatar", "createdAt"];
export const info = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return { success: false, status: 400, message: "Invalid credentials" };
    }
    return {
      success: true,
      data: {
        user: getInfoData({
          fields: select,
          object: user,
        }),
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getAllUser = async () => {
  try {
    const result = await User.find({}, select);
    if (!result) {
      return { success: false, status: 400, message: "Invalid credentials" };
    }
    return {
      success: true,
      data: {
        result: result,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (email, oldPassword, newPassword) => {
  try {
    // 1️⃣ Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, message: "Invalid email", status: 404 };
    }

    // 2️⃣ Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return {
        success: false,
        message: "Old password is incorrect",
        status: 400,
      };
    }

    // 3️⃣ Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 4️⃣ Cập nhật mật khẩu mới cho người dùng
    user.password = hashedPassword;
    await user.save();

    return {
      success: true,
      message: "Password changed successfully",
      data: {
        user: getInfoData({
          fields: select,
          object: user,
        }),
      },
    };
  } catch (error) {
    console.error("Error: ", error);
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
    };
  }
};

export const createUser = async (name, email, role = "student") => {
  try {
    if (!name || !email) {
      return {
        success: false,
        status: 400,
        message: "All fields are required",
      };
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        success: false,
        status: 400,
        message: "Email is already in use",
      };
    }
    const password = generateToken();
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = new User({ name, email, password: hashedPassword, role });

    await newUser.save();

    return {
      success: true,
      data: {
        message: "User registered successfully",
        user: {
          id: newUser._id,
          name,
          email,
          password,
          role,
        },
      },
    };
  } catch (error) {
    throw error;
  }
};

export const updatedUser = async (userId, userStats) => {
  try {
    const user = await User.findByIdAndUpdate(userId, userStats, { new: true });
    if (!user) {
      return { success: false, status: 404, message: "User not found" };
    }
    return { success: true, message: "User updated successfully", user };
  } catch (error) {
    throw error;
  }
  ss;
};

export const deleteUser = async (userId) => {
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return { success: false, status: 404, message: "User not found" };
    }
    // Remove the user's enrolled courses from the courses they are enrolled in\
    await Course.updateMany(
      { enrolledUsers: userId }, // Find courses where the user is enrolled
      { $pull: { enrolledUsers: userId } } // Remove the user from the array
    );
    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    throw error;
  }
};

export const enrollCourse = async (userId, courseId) => {
  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, status: 404, message: "User not found" };
    }

    // Initialize user.enrolledCourses if it's null
    if (!Array.isArray(user.enrolledCourses)) {
      user.enrolledCourses = [];
    }

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return { success: false, status: 404, message: "Course not found" };
    }

    // Initialize course.enrolledUsers if it's null
    if (!Array.isArray(course.enrolledUsers)) {
      course.enrolledUsers = [];
    }

    // Check if the user is already enrolled in the course
    const isAlreadyEnrolled = user.enrolledCourses.some(
      (enrolled) => enrolled.courseId.toString() === courseId
    );

    if (isAlreadyEnrolled) {
      return {
        success: false,
        status: 400,
        message: "User is already enrolled in this course",
      };
    }

    // Add course to user's enrolled courses
    user.enrolledCourses.push({ courseId });
    await user.save();

    // Optionally, add the user to the course's enrolled users
    if (!course.enrolledUsers.includes(userId)) {
      course.enrolledUsers.push(userId);
      await course.save();
    }

    return { success: true, data: { user, course } };
  } catch (error) {
    console.error("Error enrolling user to course:", error);
    throw new Error("Failed to enroll user in course");
  }
};
