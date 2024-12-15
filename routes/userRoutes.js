import express from "express";
import { getAll, getUserById, info } from "../controllers/userController.js";
import authenticate from "../middlewares/authMiddleware.js";
const userRoutes = express.Router();

userRoutes.use(authenticate);

userRoutes.get("/info", info);
userRoutes.get("/get-all", getAll);
userRoutes.get("/get-user-by-id", getUserById);

export default userRoutes;
