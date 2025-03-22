import express from "express";
import ProgressController from "../controllers/progressController.js";
import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(authenticate);

router.post("/:userId/:courseId", ProgressController.initProgress);
router.get("/:userId/:courseId", ProgressController.getProgress);
router.put("/:userId/:courseId/exercise/:exerciseId", ProgressController.updateProgressOnExerciseSubmission);
router.put("/:userId/:courseId/section/:sectionId", ProgressController.updateProgressOnSectionCompletion);

export default router;