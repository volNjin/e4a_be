import sectionService from "../services/sectionService.js";

// 1. Thêm một section mới
export const addSection = async (req, res) => {
  const { title, content, courseId, video } = req.body;

  if (!title || !courseId) {
    return res
      .status(400)
      .json({ message: "Title, courseId, and order are required" });
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
    return res.status(500).json({ message: error.message });
  }
};

// 2. Lấy tất cả sections của một course
export const getSectionsByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const sections = await sectionService.getSectionsByCourse(courseId);
    return res.status(200).json({ success: true, sections });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
export const getSection = async (req, res)=>{
  const {sectionId} = req.params;

  try {
    const sections = await sectionService.getSection(sectionId);
    return res.status(200).json({ success: true, section });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}
// 3. Cập nhật thông tin của một section
export const updateSection = async (req, res) => {
  const { sectionId } = req.params;
  const { title, content, order, video } = req.body;

  if (!title && !content && !order && !video) {
    return res.status(400).json({
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
      return res.status(404).json({ message: "Section not found" });
    }
    return res.status(200).json({ success: true, section: updatedSection });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// 4. Xóa một section
export const deleteSection = async (req, res) => {
  const { sectionId } = req.params;

  try {
    const deletedSection = await sectionService.deleteSection(sectionId);
    if (!deletedSection) {
      return res.status(404).json({ message: "Section not found" });
    }
    return res.status(200).json({ success: true, message: "Section deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
