import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Rftk from "../models/Rftk.js";
import { generateAccessToken, generateRefreshToken } from "../helpers/jwt.js";

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

export const register = async (name, email, password, role = "student") => {
  try {
    if (!name || !email || !password) {
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

    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = new User({ name, email, password: hashedPassword, role });

    await newUser.save();

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    const rftk = new Rftk({ userId: newUser._id, refreshToken });
    await rftk.save();

    return {
      success: true,
      data: {
        message: "User registered successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
        accessToken,
        refreshToken,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const refreshToken = async (token) => {
  try {
    if (!token) {
      return {
        success: false,
        status: 400,
        message: "Refresh token is required",
      };
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const { iat, exp, ...user } = decoded;

    const accessToken = generateAccessToken(user);

    return {
      success: true,
      data: { accessToken },
    };
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return { success: false, status: 401, message: "Invalid refresh token" };
    }
    throw error;
  }
};
