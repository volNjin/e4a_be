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

export { info, getAll, getUserById, changePassword };
