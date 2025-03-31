import express from "express";
import ProgressController from "../controllers/progressController.js";
import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(authenticate);

router.get("/:courseId", ProgressController.getProgress);

export default router;