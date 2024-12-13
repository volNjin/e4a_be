import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
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
      },
    };
  } catch (error) {
    throw error;
  }
};
