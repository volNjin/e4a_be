import * as userService from "../services/userService.js";
import mailService from "../services/mailService.js";
import courseService from "../services/courseService.js";
import * as progressService from "../services/progressService.js";

const info = async (req, res) => {
  try {
    const result = await userService.info(req.user.id);
    if (!result.success) {
      return res
        .status(result.status)
        .json({ success: false, message: result.message });
    }
    res.status(200).json(result.data);
  } catch (error) {
    res
      .status(404)
      .json({ success: false, message: "Internal server error", error });
  }
};
const getUserById = async (req, res) => {
  try {
    const result = await userService.info(req.query.id);
    if (!result.success) {
      return res
        .status(result.status)
        .json({ success: false, message: result.message });
    }
    res.status(200).json(result.data);
  } catch (error) {
    res
      .status(404)
      .json({ success: false, message: "Internal server error", error });
  }
};

const getAll = async (req, res) => {
  try {
    // Lấy filters từ query parameters
    const filters = {
      name: req.query?.name,
      email: req.query?.email,
      courseId: req.query?.courseId,
    };

    const requestingUser = req.user; // Lấy user từ middleware
    console.log(requestingUser);
    let query = {};

    if (requestingUser.role === "admin") {
      // Admin có thể xem tất cả user
      query = {
        ...filters,
      };
    } else if (requestingUser.role === "teacher") {
      query = { role: "student", ...filters };
      if (!filters.courseId) {
        const courses = await courseService.getMyCourses(requestingUser);
        const courseIds = courses.map((course) => course._id);
        // Teacher chỉ xem student trong các khóa học của họ
        query = {
          courseIds: courseIds,
          ...filters,
        };
      }
    } else {
      // Các role khác không được phép truy cập
      return res.status(400).json({
        success: false,
        message: "User do not have permission to use this function",
      });
    }
    // Gọi service để lấy danh sách user
    const users = await userService.getAllUsers(query);

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found matching the criteria",
      });
    }

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const email = req.user.email;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đầy đủ mật khẩu cũ và mật khẩu mới.",
      });
    }

    // Gọi service để đổi mật khẩu
    const result = await userService.changePassword(
      email,
      oldPassword,
      newPassword
    );
    if (!result.success) {
      return res
        .status(result.status)
        .json({ success: false, message: result.message });
    }
    try {
      await mailService.changePasswordNotification(
        email,
        result.data.user.name
      );
      console.log("Welcome email sent successfully");
    } catch (emailError) {
      console.error("Error sending change password notification:", emailError);
      // Optional: You can choose to continue, log it, or notify an admin
    }
    res
      .status(200)
      .json({ success: true, message: "Change password successfully!" });
  } catch (error) {
    console.error("Failed to change password:", error);
    res
      .status(404)
      .json({ success: false, message: "Internal server error: ", error });
  }
};

const createUser = async (req, res) => {
  try {
    const userRole = req.user?.role;
    if (userRole !== "admin" && userRole !== "teacher") {
      return res
        .status(400)
        .json({ message: "User do not have permission to use this function" });
    }
    const { name, email, role } = req.body;

    // Step 1: Call the userService to create the user
    const result = await userService.createUser(name, email, role);
    if (!result.success) {
      return res
        .status(result.status)
        .json({ success: false, message: result.message });
    }

    // Step 2: Send welcome email to the user
    try {
      const password = result.data.user.password;
      await mailService.sendWelcomeEmail(email, name, password);
      console.log("Welcome email sent successfully");
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      // Optional: You can choose to continue, log it, or notify an admin
    }

    // Step 3: Return a response to the client
    res.status(201).json({ success: true, message: result.data.message });
  } catch (error) {
    console.error("Error during registration:", error);
    res
      .status(404)
      .json({ success: false, message: "Internal server error", error });
  }
};

const createUserBatch = async (req, res) => {
  try {
    const userRole = req.user?.role;
    if (userRole !== "admin" && userRole !== "teacher") {
      return res
        .status(400)
        .json({ message: "User do not have permission to use this function" });
    }
    const toCreateUser = req.body; // Mảng người dùng
    if (!Array.isArray(toCreateUser) || toCreateUser.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid input. Expected an array of users." });
    }

    const results = [];

    for (const user of toCreateUser) {
      const { name, email } = user;

      // Kiểm tra dữ liệu người dùng
      if (!name || !email) {
        results.push({
          email,
          success: false,
          message: "Missing required fields: name, email",
        });
        continue;
      }

      try {
        // 🟡 Step 1: Gọi userService để đăng ký người dùng
        const result = await userService.createUser(name, email, "student");

        if (!result.success) {
          results.push({
            email,
            success: false,
            message: result.message || "Failed to register user.",
          });
          continue;
        }

        // 🟢 Step 2: Gửi email chào mừng cho người dùng
        try {
          const password = result.data.user.password;
          await mailService.sendWelcomeEmail(email, name, password);
          console.log(`Welcome email sent successfully to ${email}`);
        } catch (emailError) {
          console.error(`Error sending welcome email to ${email}:`, emailError);
        }

        // 🟢 Ghi nhận người dùng thành công
        results.push({
          email,
          success: true,
          message: "User registered successfully.",
        });
      } catch (error) {
        console.error(`Error registering user with email ${email}:`, error);
        results.push({
          email,
          success: false,
          message: "Internal server error during user registration.",
        });
      }
    }

    res.status(201).json({ success: true, results });
  } catch (error) {
    console.error("Error during batch registration:", error);
    res
      .status(404)
      .json({ success: false, message: "Internal server error", error });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    const updatedData = req.body;
    console.log(updatedData);
    const result = await userService.updateUser(userId, updatedData);
    if (!result.success) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: result.updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(404)
      .json({ success: false, message: "Internal server error", error });
  }
};

export const uploadImage = async (req, res) => {
  try {
    const userId = req.user?.id;
    const file = req.file; // Extract the uploaded file from the request
    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const result = await userService.uploadImageToCloudinary(userId, file);
    if (!result.success) {
      return res.status(404).json({ success: false, message: result.message });
    }

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: result,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userRole = req.user?.role;
    if (userRole !== "admin" && userRole !== "teacher") {
      return res
        .status(400)
        .json({ message: "User do not have permission to use this function" });
    }
    const { id } = req.params;
    console.log(id);
    const result = await userService.deleteUser(id);
    if (!result.success) {
      return res
        .status(result.status)
        .json({ success: false, message: result.message });
    }
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(404)
      .json({ success: false, message: "Internal server error", error });
  }
};

const deleteUserBatch = async (req, res) => {
  try {
    const userRole = req.user?.role;
    if (userRole !== "admin" && userRole !== "teacher") {
      return res
        .status(400)
        .json({ message: "User do not have permission to use this function" });
    }
    const toDeleteUsers = req.body; // Mảng id người dùng
    if (!Array.isArray(toDeleteUsers) || toDeleteUsers.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid input. Expected an array of user IDs." });
    }
    const results = [];
    for (const userId of toDeleteUsers) {
      const result = await userService.deleteUser(userId);
      if (!result.success) {
        results.push({
          userId,
          success: false,
          message: result.message || "Failed to delete user.",
        });
        continue;
      }
      results.push({
        userId,
        success: true,
        message: "User deleted successfully.",
      });
    }
    res.status(200).json({ success: true, results });
  } catch (error) {
    console.error("Error deleting users:", error);
    res
      .status(404)
      .json({ success: false, message: "Internal server error", error });
  }
};

const enrollCourse = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { courseId } = req.params;

    const result = await userService.enrollCourse(userId, courseId);

    if (!result.success) {
      return res
        .status(result.status)
        .json({ success: false, message: result.message });
    }

    try {
      await progressService.initProgress(userId, courseId);
    } catch (error) {
      console.error("Error initializing progress for enrolled user:", error);
      return res
        .status(404)
        .json({ success: false, message: "Internal server error", error });
    }

    res.status(200).json({
      success: true,
      message: "Enrolled successfully",
      data: result.data,
    });
  } catch (error) {
    console.error("Error enrolling course:", error);
    res
      .status(404)
      .json({ success: false, message: "Internal server error", error });
  }
};

export {
  info,
  getAll,
  getUserById,
  changePassword,
  createUser,
  createUserBatch,
  updateUser,
  deleteUser,
  deleteUserBatch,
  enrollCourse,
};
