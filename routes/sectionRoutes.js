import express from "express";
import {
  addSection,
  getSectionsByCourse,
  updateSection,
  deleteSection,
} from "../controllers/sectionController.js";

const sectionRoutes = express.Router();

// POST /api/sections - Add a new section
sectionRoutes.post("/", addSection);

// GET /api/sections/:courseId - Get all sections of a specific course
sectionRoutes.get("/:courseId", getSectionsByCourse);

// PUT /api/sections/:sectionId - Update a section by its ID
sectionRoutes.put("/:sectionId", updateSection);

// DELETE /api/sections/:sectionId - Delete a section by its ID
sectionRoutes.delete("/:sectionId", deleteSection);

export default sectionRoutes;
