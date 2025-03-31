import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Course from "../models/Course.js";
import { getInfoData } from "../utils/index.js";
import { generateToken } from "../helpers/randomToken.js";
import cloudinaryService from "./cloudinaryService.js";

const select = ["name", "role", "email", "avatar", "createdAt"];
const imageFolder = "avatars";
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

export const getAllUsers = async (filters) => {
  try {
    // Tạo query từ filters
    const query = {};
    if (filters.name) {
      query.name = { $regex: filters.name, $options: "i" }; // Tìm kiếm không phân biệt hoa thường
    }
    if (filters.email) {
      query.email = { $regex: filters.email, $options: "i" }; // Tìm kiếm không phân biệt hoa thường
    }
    if (filters.courseId) {
      query["enrolledCourses.courseId"] = filters.courseId; // Tìm kiếm theo courseId
    }

    if (filters.courseIds) {
      query["enrolledCourses.courseId"] = { $in: filters.courseIds }; // Tìm kiếm theo courseIds
    }
    // Truy vấn với populate để lấy thông tin khóa học
    const users = await User.find(query).select("-password");

    return users;
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

export const updateUser = async (userId, updatedData) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true }
    ).select("-password");
    if (!updatedUser) {
      return { success: false, status: 404, message: "User not found" };
    }
    return { success: true, message: "User updated successfully", updatedUser };
  } catch (error) {
    throw error;
  }
};

export const uploadImageToCloudinary = async (userId, file) => {
  try {
    // Upload the file to Cloudinary
    const result = await cloudinaryService.uploadImageToCloudinary(
      file,
      imageFolder
    );

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: result.url },
      { new: true }
    );

    if (!user) {
      return { success: false, status: 404, message: "User not found" };
    }

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to upload image");
  }
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
