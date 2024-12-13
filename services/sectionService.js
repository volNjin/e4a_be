import Section from "../models/Section.js";

const sectionService = {
  // 1. Thêm một section mới
  async addSection(
    title,
    content,
    courseId,
    parent,
    order,
    videos = [],
    exercises = []
  ) {
    try {
      const newSection = new Section({
        title,
        content,
        course: courseId,
        parent,
        order,
        videos,
        exercises,
      });

      await newSection.save();
      return newSection;
    } catch (error) {
      throw new Error("Failed to add section");
    }
  },

  // 2. Lấy tất cả sections của một course, có phân loại theo thứ tự
  async getSectionsByCourse(courseId) {
    try {
      const sections = await Section.find({ course: courseId }).sort({
        order: 1,
      }); // Sắp xếp theo thứ tự
      return sections;
    } catch (error) {
      throw new Error("Failed to fetch sections");
    }
  },
  // 3. Lấy tất cả sections con của một section, có phân loại theo thứ tự
  async getSectionsByParent(parentId) {
    try {
      const sections = await Section.find({ parent: parentId }).sort({
        order: 1,
      }); // Sắp xếp theo thứ tự
      return sections;
    } catch (error) {
      throw new Error("Failed to fetch sections");
    }
  },

  // 4. Cập nhật một section
  async updateSection(sectionId, title, content, order, videos, exercises) {
    try {
      const sectionToUpdate = await Section.findById(sectionId);

      if (!sectionToUpdate) {
        throw new Error("Section not found");
      }

      const { parent, oldOrder } = sectionToUpdate;

      if (oldOrder !== order) {
        // Nếu thứ tự thay đổi, cần cập nhật lại các Section khác trong khóa học
        if (oldOrder < order) {
          // Nếu oldOrder nhỏ hơn order, giảm thứ tự các Section có order lớn hơn
          await Section.updateMany(
            { parent, order: { $gt: oldOrder, $lt: order } },
            { $inc: { order: -1 } }
          );
        } else if (oldOrder > order) {
          // Nếu oldOrder lớn hơn order, tăng thứ tự các Section có order nhỏ hơn
          await Section.updateMany(
            { parent, order: { $lt: oldOrder, $gt: order } },
            { $inc: { order: 1 } }
          );
        }
      }
      // Cập nhật thông tin của Section
      const updatedSection = await Section.findByIdAndUpdate(
        sectionId,
        { title, content, order, videos, exercises },
        { new: true }
      );

      return updatedSection;
    } catch (error) {
      throw new Error("Failed to update section");
    }
  },

  // 5. Xóa một section
  async deleteSection(sectionId) {
    try {
      const sectionToDelete = await Section.findById(sectionId);

      if (!sectionToDelete) {
        throw new Error("Section not found");
      }

      const { course, order } = sectionToDelete;

      // Xóa section
      await Section.findByIdAndDelete(sectionId);

      // Cập nhật lại thứ tự của các section còn lại
      await Section.updateMany(
        { course, order: { $gt: order } }, // Tìm các Section có thứ tự lớn hơn thứ tự của Section bị xóa
        { $inc: { order: -1 } } // Giảm thứ tự của các Section còn lại
      );

      return sectionToDelete; // Trả về Section đã bị xóa
    } catch (error) {
      throw new Error("Failed to delete section");
    }
  },
};

export default sectionService;
