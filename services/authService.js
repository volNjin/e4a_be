import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import { generateAccessToken } from "../helpers/jwt.js";
export const login = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, status: 400, message: "Invalid credentials" };
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return { success: false, status: 400, message: "Invalid credentials" };
    }

    const accessToken = generateAccessToken(user);

    return {
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          accessToken,
        },
      },
    };
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (email, newPassword) => {
  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    // Delete the OTP after successful password reset
    await Otp.deleteOne({ email });

    return { success: true };
  } catch (err) {
    throw new Error(err.message);
  }
};
