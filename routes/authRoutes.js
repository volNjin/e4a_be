import express from "express";
import {
  register,
  login,
  requestPasswordReset,
  resetPassword,
  registerBatch,
} from "../controllers/authController.js";

const authRoutes = express.Router();

// Register a new user
authRoutes.post("/register", register);
authRoutes.post("/register-batch", registerBatch);
// Login a user and return tokens
authRoutes.post("/login", login);

authRoutes.post("/request-password-reset", requestPasswordReset);
authRoutes.post("/reset-password", resetPassword);
export default authRoutes;
