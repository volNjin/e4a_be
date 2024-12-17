import express from "express";
import {
  getAll,
  getUserById,
  info,
  changePassword,
  createUser,
  createUserBatch,
  enrollCourse,
} from "../controllers/userController.js";
import authenticate from "../middlewares/authMiddleware.js";
const userRoutes = express.Router();

userRoutes.use(authenticate);

userRoutes.post("/create-user", createUser);
userRoutes.post("/create-user-batch", createUserBatch);
userRoutes.get("/info", info);
userRoutes.get("/get-all", getAll);
userRoutes.get("/get-user-by-id", getUserById);
userRoutes.put("/change-password", changePassword);

userRoutes.post("/enroll-course/:courseId", enrollCourse);
export default userRoutes;
