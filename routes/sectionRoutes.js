import express from "express";
import {
  addSection,
  getSectionsByCourse,
  getSection, // New API for getting a single section's id and title
  updateSection,
  deleteSection,
  getSectionsByCourseAndOrder,
} from "../controllers/sectionController.js";
import authenticate from "../middlewares/authMiddleware.js";

const sectionRoutes = express.Router();
sectionRoutes.use(authenticate);
// 1️⃣ POST /api/sections - Add a new section
sectionRoutes.post("/", addSection);

// 2️⃣ GET /api/sections/course/:courseId - Get all sections (id, title) of a specific course
sectionRoutes.get("/course/:courseId", getSectionsByCourse);

sectionRoutes.get("/courseAndOrder/", getSectionsByCourseAndOrder);

// 3️⃣ GET /api/sections/:sectionId - Get the id and title of a specific section
sectionRoutes.get("/:sectionId", getSection);

// 4️⃣ PUT /api/sections/:sectionId - Update a section by its ID
sectionRoutes.put("/:sectionId", updateSection);

// 5️⃣ DELETE /api/sections/:sectionId - Delete a section by its ID
sectionRoutes.delete("/:sectionId", deleteSection);

export default sectionRoutes;
