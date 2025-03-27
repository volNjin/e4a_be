import express from "express";
import translatorController from "../controllers/translatorController.js";
import authenticate from "../middlewares/authMiddleware.js";
const router = express.Router();
router.use(authenticate);

// POST route to translate text
router.post("/", translatorController.translateText);

export default router;