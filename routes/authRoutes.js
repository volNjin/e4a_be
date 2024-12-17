import express from "express";
import {
  register,
  login,
  requestPasswordReset,
  verifyOtp,
  resetPassword,
} from "../controllers/authController.js";

const authRoutes = express.Router();

// Register a new user
authRoutes.post("/register", register);

// Login a user and return tokens
authRoutes.post("/login", login);

authRoutes.post("/request-password-reset", requestPasswordReset);
authRoutes.post("/verify-otp", verifyOtp);
authRoutes.post("/reset-password", resetPassword);
export default authRoutes;
