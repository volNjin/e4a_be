import express from "express";
import {
  getAll,
  getUserById,
  info,
  changePassword,
  createUser,
  createUserBatch,
  updateUser,
  uploadImage,
  deleteUser,
  deleteUserBatch,
  enrollCourse,
} from "../controllers/userController.js";
import authenticate from "../middlewares/authMiddleware.js";
import upload from "../config/multer.js";

const userRoutes = express.Router();

userRoutes.use(authenticate);

userRoutes.post("/create-user", createUser);
userRoutes.post("/create-user-batch", createUserBatch);
userRoutes.delete("/delete-user/:id", deleteUser);
userRoutes.delete("/delete-user-batch", deleteUserBatch);

userRoutes.get("/info", info);
userRoutes.get("/get-all", getAll);
userRoutes.get("/get-user-by-id", getUserById);
userRoutes.put("/change-password", changePassword);
userRoutes.put("/update-user", updateUser);
userRoutes.post("/upload-image",upload.single("image"), uploadImage);

userRoutes.post("/enroll-course/:courseId", enrollCourse);
export default userRoutes;
