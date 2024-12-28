import express from "express";
import upload from "../config/multer.js";

const ckRouter = express.Router();

ckRouter.post("/", (req, res) => {
  const uploadMiddleware = upload.single("upload"); // Tên field phải trùng với tên field trong FormData
  uploadMiddleware(req, res, (err) => {
    console.log(req.body);
    if (err) {
      console.error("Upload error:", err.message); // Log chi tiết lỗi
      return res.status(400).json({
        error: err.message || "File upload failed",
      });
    }

    if (!req.file) {
      console.error("No file uploaded");
      return res.status(400).json({
        error: "No file uploaded", // Lỗi khi không có file
      });
    }

    // Thành công
    console.log("File uploaded:", req.file);
    res.status(200).json({
      url: `/ck-editor/${req.file.filename}`, // Đường dẫn file đã upload
    });
  });
});

export default ckRouter;
