import User from "../models/User.js";
import { getInfoData } from "../utils/index.js";
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
