import * as userService from "../services/userService.js";

const info = async (req, res) => {
  try {
    const result = await userService.info();
    return "oke";
    if (!result.success) {
      return res.status(result.status).json({ message: result.message });
    }

    res.status(200).json(result.data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export { info };