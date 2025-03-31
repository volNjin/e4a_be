import * as ProgressService from "../services/progressService.js";

class ProgressController {
  async getProgress(req, res) {
    try {
      const { userId, courseId } = req.params;
      const data = await ProgressService.getProgress(userId, courseId);
      if (!data.success) {
        return res
          .status(404)
          .json({ success: false, message: "Progress not found" });
      }
      res.status(200).json({ success: true, progress: data.progress });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
export default new ProgressController();
