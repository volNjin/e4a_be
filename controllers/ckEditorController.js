import * as userService from "../services/userService.js";

const info = async (req, res) => {
  try {
    const result = await userService.info(req.user.id);
    if (!result.success) {
      return res
        .status(result.status)
        .json({ success: false, message: result.message });
    }
    res.status(200).json(result.data);
  } catch (error) {
    res
      .status(404)
      .json({ success: false, message: "Internal server error", error });
  }
};

export { info };
