import express from "express";
import { info } from "../controllers/userController.js";
import authenticate from "../middlewares/authMiddleware.js";
const userRoutes = express.Router();

userRoutes.use(authenticate);

userRoutes.get("/info", info);

export default userRoutes;
