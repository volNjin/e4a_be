import sectionService from "../services/sectionService.js";
import { updateProgressOnSectionCompletion } from "../services/progressService.js";

// 1. Thêm một section mới
export const addSection = async (req, res) => {
  const { title, content, courseId, video } = req.body;

  if (!title || !courseId) {
    return res.status(400).json({
      success: false,
      message: "Title, courseId, and order are required",
    });
  }
  const nextSectionOrder = await sectionService.getNextSectionOrder(courseId);

  try {
    const newSection = await sectionService.addSection(
      title,
      content,
      courseId,
      nextSectionOrder,
      video
    );
    return res.status(201).json({ success: true, section: newSection });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Lấy tất cả sections của một course
export const getSectionsByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const userId = req.user.id;
    const sections = await sectionService.getSectionsByCourse(userId, courseId);
    return res.status(200).json({ success: true, sections });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSectionByCourseAndOrder = async (req, res) => {
  const { courseId, order } = req.body;

  try {
    const result = await sectionService.getSectionByCourseAndOrder(
      courseId,
      order
    );
    if (!result.success) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }
    if (req.user.role === "student") {
      const userId = req.user._id;
      await updateProgressOnSectionCompletion(userId, courseId, result.section._id);
    }
    return res.status(200).json({ success: true, section: result.section });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSection = async (req, res) => {
  const { sectionId } = req.params;

  try {
    const data = await sectionService.getSection(sectionId);
    if (!data.success) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }

    return res.status(200).json({
      success: true,
      section: data.section,
      totalSections: data.totalSections,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
// 3. Cập nhật thông tin của một section
export const updateSection = async (req, res) => {
  const { sectionId } = req.params;
  const { title, content, order, video } = req.body;

  if (!title && !content && !order && !video) {
    return res.status(400).json({
      success: false,
      message:
        "At least one field (title, content, order, video) is required for update",
    });
  }

  try {
    const updatedSection = await sectionService.updateSection(
      sectionId,
      title,
      content,
      order,
      video
    );
    if (!updatedSection) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }
    return res.status(200).json({ success: true, section: updatedSection });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Xóa một section
export const deleteSection = async (req, res) => {
  const { sectionId } = req.params;

  try {
    const deletedSection = await sectionService.deleteSection(sectionId);
    if (!deletedSection) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }
    return res.status(200).json({ success: true, message: "Section deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
