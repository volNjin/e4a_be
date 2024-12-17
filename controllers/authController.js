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

export { login, requestPasswordReset, resetPassword };
