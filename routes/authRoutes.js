import express from "express";
import {
  login,
  requestPasswordReset,
  resetPassword,
} from "../controllers/authController.js";

const authRoutes = express.Router();


// Login a user and return tokens
authRoutes.post("/login", login);

authRoutes.post("/request-password-reset", requestPasswordReset);
authRoutes.post("/reset-password", resetPassword);
export default authRoutes;
