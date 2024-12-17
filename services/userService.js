import User from "../models/user.js";
import { getInfoData } from "../utils/index.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../helpers/randomToken.js";

const select = ["name", "email", "avatar", "createdAt"];
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
export const getAllUser = async () => {
  try {
    const result = await User.find({}, select);
    if (!result) {
      return { success: false, status: 400, message: "Invalid credentials" };
    }
    return {
      success: true,
      data: {
        result: result,
      },
    };
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
