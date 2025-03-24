import express from "express";
import * as ExerciseController from "../controllers/exerciseController.js";
import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(authenticate);

router.post("/", ExerciseController.createExercise);
router.get("/:exerciseId", ExerciseController.getExerciseById);
router.put("/:exerciseId", ExerciseController.updateExercise);
router.delete("/:exerciseId", ExerciseController.deleteExercise);
router.get("/", ExerciseController.getAllExercises);
router.get("/by-section/:sectionId", ExerciseController.getExercisesBySection);

export default router;