import express from "express";
import ProgressController from "../controllers/progressController.js";
import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(authenticate);

router.post("/:courseId", ProgressController.initProgress);
router.get("/:courseId", ProgressController.getProgress);
router.put("/:courseId/exercise/:exerciseId", ProgressController.updateProgressOnExerciseSubmission);

export default router;