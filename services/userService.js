import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { generateAccessToken, generateRefreshToken } from "../helpers/jwt.js";

export const getInfo = async (req, res) => {
  return "oke";
};
