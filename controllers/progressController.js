import * as ProgressService from "../services/progressService.js";

class ProgressController {
  async getProgress(req, res) {
    try {
      const { userId, courseId } = req.params;
      const progress = await ProgressService.getProgress(userId, courseId);
      if (!progress) {
        return res
          .status(404)
          .json({ success: false, message: "Progress not found" });
      }
      res.status(200).json({ success: true, progress });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async initProgress(req, res) {
    try {
      const { userId, courseId } = req.params;
      const progress = await ProgressService.initProgress(userId, courseId);
      if (!progress.success) {
        return res.status(400).json({ success: false, message: progress.message });
      }
      res.status(201).json({ success: true, progress });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateProgressOnExerciseSubmission(req, res) {
    try {
      const userId = req.user.id;
      const { courseId, exerciseId } = req.params;
      const { status, score, feedback } = req.body;
      const progress = await ProgressService.updateProgressOnExerciseSubmission(
        userId,
        courseId,
        exerciseId,
        status,
        score,
        feedback
      );
      res.status(200).json({ success: true, progress });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new ProgressController();
