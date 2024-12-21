import progressService from "../services/progressService.js";

export const getProgress = async (req, res) => {
  try {
    const user = req.user;
    const progress = await progressService.getProgress(user);
    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markComplete = async (req, res) => {
  try {
    const { courseId } = req.params;
    const user = req.user;
    const result = await progressService.markComplete(user, courseId);
    if (!result.success) {
      return res
        .status(result.status)
        .json({ success: false, message: result.message });
    }
    res.status(201).json({ success: true, message: result.message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
