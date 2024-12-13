import express from "express";
import { info } from "../controllers/userController.js";
import authenticate from "../middlewares/authMiddleware.js";
const userRoutes = express.Router();
userRoutes.use(authenticate);
// Login a user and return tokens
userRoutes.post("/info", info);

export default userRoutes;
