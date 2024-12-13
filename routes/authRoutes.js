import express from "express";
import { register, login } from "../controllers/authController.js";

const authRoutes = express.Router();

// Register a new user
authRoutes.post("/register", register);

// Login a user and return tokens
authRoutes.post("/login", login);

export default authRoutes;
