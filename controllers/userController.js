import * as userService from "../services/userService.js";
import mailService from "../services/mailService.js";
const info = async (req, res) => {
  try {
    const result = await userService.info(req.user.id);
    if (!result.success) {
      return res.status(result.status).json({ message: result.message });
    }
    res.status(200).json(result.data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
const getUserById = async (req, res) => {
  try {
    const result = await userService.info(req.query.id);
    if (!result.success) {
      return res.status(result.status).json({ message: result.message });
    }
    res.status(200).json(result.data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
const getAll = async (req, res) => {
  try {
    const result = await userService.getAllUser();
    if (!result.success) {
      return res.status(result.status).json({ message: result.message });
    }
    res.status(200).json(result.data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Vui lòng cung cấp đầy đủ email, mật khẩu cũ và mật khẩu mới.",
      });
    }

    // Gọi service để đổi mật khẩu
    const result = await userService.changePassword(
      email,
      oldPassword,
      newPassword
    );
    if (!result.success) {
      return res.status(result.status).json({ message: result.message });
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
    res.status(200).json({ message: "Change password successfully!" });
  } catch (error) {
    console.error("Failed to change password:", error);
    res.status(500).json({ message: "Internal server error: ", error });
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
      return res.status(result.status).json({ message: result.message });
    }

    // Step 2: Send welcome email to the user
    try {
      const password = result.data.password;
      await mailService.sendWelcomeEmail(email, name, password);
      console.log("Welcome email sent successfully");
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      // Optional: You can choose to continue, log it, or notify an admin
    }

    // Step 3: Return a response to the client
    res.status(201).json({ success: true, message: result.data.message});
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error", error });
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
          const password = result.data.password;
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
    res.status(500).json({ message: "Internal server error", error });
  }
};

export {
  info,
  getAll,
  getUserById,
  changePassword,
  createUser,
  createUserBatch,
};
