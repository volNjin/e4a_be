import multer from "multer";
import path from "path";
import fs from "fs/promises"; // For creating directories dynamically

// Dynamic storage configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      let uploadPath;
      // Determine folder based on route
      if (req.baseUrl.includes("/user")) {
        uploadPath = "uploads/user";
      } else if (req.baseUrl.includes("/course")) {
        uploadPath = "uploads/course";
      } else if (req.baseUrl.includes("/post")) {
        uploadPath = "uploads/post";
      } else if (req.baseUrl.includes("/ck-editor")) {
        uploadPath = "uploads/ck-editor";
      } else {
        return cb(new Error("Invalid upload route"));
      }
      await fs.mkdir(uploadPath, { recursive: true }); // Ensure directory exists
      cb(null, uploadPath);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/\s+/g, "_"); // Replace spaces with underscores
    cb(null, `${timestamp}-${originalName}`);
  },
});

// File filter for image types
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif/;
  const isExtensionValid = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const isMimeTypeValid = allowedFileTypes.test(file.mimetype);

  if (isExtensionValid && isMimeTypeValid) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

// Multer middleware
const upload = multer({ storage, fileFilter });

export default upload;
