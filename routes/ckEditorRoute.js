import express from "express";
import upload from "../config/multer.js";
import authenticate from "../middlewares/authMiddleware.js";

const ckRouter = express.Router();
ckRouter.use(authenticate);

ckRouter.post("/", (req, res) => {
  const uploadMiddleware = upload.single("upload"); // Tên field phải trùng với tên field trong FormData
  uploadMiddleware(req, res, (err) => {
    if (err) {
      console.error("Upload error:", err.message); // Log chi tiết lỗi
      return res.status(400).json({
        error: err.message || "File upload failed",
      });
    }

    if (!req.file) {
      console.error("No file uploaded");
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    res.status(200).json({
      url: `/ck-editor/${req.file.filename}`,
    });
  });
});

export default ckRouter;
