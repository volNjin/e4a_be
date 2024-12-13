import {verifyToken} from "../helpers/jwt.js"

const authenticate = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = verifyAccessToken(token); // Xác thực token
    req.user = decoded; // Lưu thông tin người dùng vào req.user
    next(); // Tiếp tục xử lý yêu cầu
  } catch (error) {
    return res.status(400).json({ message: "Invalid token" });
  }
};

export default authenticate
