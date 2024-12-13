import { verifyAccessToken } from "../helpers/jwt.js";

const authenticate = (req, res, next) => {
  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    console.log(decoded);
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token" });
  }
};

export default authenticate;
