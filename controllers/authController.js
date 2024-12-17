import * as authService from "../services/authService.js";
import * as otpService from "../services/otpService.js";
import mailService from "../services/mailService.js";
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    if (!result.success) {
      return res.status(result.status).json({ message: result.message });
    }

    res.status(200).json({ success: true, data: result.data });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // Step 1: Call the authService to create the user
    const result = await authService.register(name, email, role);
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
    res.status(201).json({ success: true, data: result.data });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const registerBatch = async (req, res) => {
  try {
    const users = req.body; // Mảng người dùng
    if (!Array.isArray(users) || users.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid input. Expected an array of users." });
    }

    const results = [];

    for (const user of users) {
      const { name, email } = user;

      // Kiểm tra dữ liệu người dùng
      if (!name || !email ) {
        results.push({
          email,
          success: false,
          message: "Missing required fields: name, email",
        });
        continue;
      }

      try {
        // 🟡 Step 1: Gọi authService để đăng ký người dùng
        const result = await authService.register(name, email, "student");

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

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otp = await otpService.newOtp(email);
    console.log("OTP generated:", otp);
    try {
      await mailService.sendOtpEmail(email, otp);
      console.log("Welcome email sent successfully");
    } catch (emailError) {
      console.error("Error sending otp email:", emailError);
      // Optional: You can choose to continue, log it, or notify an admin
    }

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error during password reset request:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// const verifyOtp = async (req, res) => {
//   const { email, otp } = req.body;

//   try {
//     const message = await otpService.verifyOtp(email, otp);
//     res.status(200).json({ success: true, message });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email, otp and new password are required" });
    }
    const verificationResult = await otpService.verifyOtp(email, otp);
    if (!verificationResult.success) {
      return res.status(400).json({ message: verificationResult.message });
    }
    try {
      const message = await authService.resetPassword(email, newPassword);

      res
        .status(200)
        .json({ success: true, message: "Password reset successfully" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  } catch (error) {
    console.error("Error during resetting password:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export { login, register,registerBatch, requestPasswordReset, resetPassword };
