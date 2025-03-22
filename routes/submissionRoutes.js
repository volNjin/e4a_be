import express from "express";
import * as SubmissionController from "../controllers/submissionController.js";
import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(authenticate);

router.post("/", SubmissionController.createSubmission);
router.get("/:submissionId", SubmissionController.getSubmissionById);
router.put("/:submissionId", SubmissionController.updateSubmission);
router.delete("/:submissionId", SubmissionController.deleteSubmission);
router.get("/", SubmissionController.getAllSubmissions);

export default router;