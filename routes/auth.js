import express from "express";
import { register, login, refreshToken } from "../controllers/authController.js";

const authRoutes = express.Router();

// Register a new user
authRoutes.post("/register", register);

// Login a user and return tokens
authRoutes.post("/login", login);

// Refresh access token using refresh token
authRoutes.post("/refresh-token", refreshToken);

export default authRoutes;
