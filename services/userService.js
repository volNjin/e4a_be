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
    const refreshToken = Rftk.findOne({ userId: user._id });

    return {
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
          accessToken,
          refreshToken,
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

export const info = async () => {
  return "oke";
};
