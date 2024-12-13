import User from "../models/User.js";
import { getInfoData } from "../utils/index.js";
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
          fields: ["name", "email", "avatar", "createdAt"],
          object: user,
        }),
      },
    };
  } catch (error) {
    throw error;
  }
};
