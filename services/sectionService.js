import Section from "../models/Section.js";
import Course from "../models/Course.js";
import mongoose from "mongoose";
import { markLastAccessedSection, updateProgressOnSectionCompletion } from "./progressService.js";
const sectionService = {
  async getNextSectionOrder(courseId) {
    try {
      const courseObjectId = new mongoose.Types.ObjectId(courseId);

      // Find the maximum order of sections for the given course
      const lastSection = await Section.findOne({ course: courseObjectId })
        .sort({ order: -1 }) // Sort by order in descending order
        .limit(1); // Get only the section with the highest order
      return lastSection ? lastSection.order + 1 : 1;
    } catch (error) {
      throw error;
    }
  },

  // 1. Thêm một section mới
  async addSection(title, content, courseId, order, video) {
    try {
      const courseObjectId = new mongoose.Types.ObjectId(courseId);
      const newSection = new Section({
        title,
        content,
        course: courseObjectId,
        order,
        video,
      });

      await newSection.save();
      // Find the course and add the new section to its sections array
      const course = await Course.findById(courseObjectId);

      if (!course) {
        throw new Error("Course not found");
      }

      // Append the new section's ObjectId to the sections array
      course.sections.push(newSection._id);

      // Save the updated course document
      await course.save();
      return newSection;
    } catch (error) {
      throw new Error("Failed to add section");
    }
  },

  // 2. Lấy tất cả sections của một course, có phân loại theo thứ tự
  async getSectionsByCourse(courseId) {
    try {
      const courseObjectId = new mongoose.Types.ObjectId(courseId);
      const sections = await Section.find(
        { course: courseObjectId },
        { _id: 1, title: 1, order: 1 }
      ).sort({
        order: 1,
      }); // Sắp xếp theo thứ tự
      return sections;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch sections");
    }
  },

  async getSectionByCourseAndOrder(userId, courseId, order) {
    try {
      const courseObjectId = new mongoose.Types.ObjectId(courseId);
      const section = await Section.findOne({ course: courseObjectId, order });
      if (!section) {
        return { success: false, message: "Section not found" };
      }
      return {success: true, section: section};
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch section");
    }
  },

  // 3. Lấy thông tin section theo id
  async getSection(sectionId) {
    try {
      // 🟢 1. Tìm kiếm Section
      const section = await Section.findById(sectionId).populate(
        "course",
        "title"
      );
      if (!section) {
        return { success: false, message: "Section not found" };
      }

      // 🟢 2. Lấy ID của khóa học3
      const courseId = section.course._id;

      // 🟢 3. Đếm số lượng section trong khóa học
      const totalSections = await Section.countDocuments({ course: courseId });

      // 🟢 4. Trả về thông tin section và tổng số section của khóa học
      return {
        success: true,
        section: section,
        totalSections: totalSections,
      };
    } catch (error) {
      console.error("Error fetching section: ", error);
      throw new Error("Failed to fetch section");
    }
  },

  // 4. Cập nhật một section
  async updateSection(sectionId, title, content, order, video) {
    try {
      const sectionToUpdate = await Section.findById(sectionId);
      if (!sectionToUpdate) {
        return { success: false, message: "Section not found" };
      }

      const course = sectionToUpdate.course;
      const oldOrder = sectionToUpdate.order;
      if (oldOrder !== order) {
        // Nếu thứ tự thay đổi, cần cập nhật lại các Section khác trong khóa học
        if (oldOrder < order) {
          // Nếu oldOrder nhỏ hơn order, giảm thứ tự các Section có order lớn hơn
          await Section.updateMany(
            { course, order: { $gt: oldOrder, $lte: order } },
            { $inc: { order: -1 } }
          );
        } else if (oldOrder > order) {
          // Nếu oldOrder lớn hơn order, tăng thứ tự các Section có order nhỏ hơn
          await Section.updateMany(
            { course, order: { $lt: oldOrder, $gte: order } },
            { $inc: { order: 1 } }
          );
        }
      }

      // Cập nhật thông tin của Section
      const updatedSection = await Section.findByIdAndUpdate(
        sectionId,
        { title, content, order, video },
        { new: true }
      );

      return { success: true, updatedSection: updatedSection };
    } catch (error) {
      console.log(error);
      throw new Error("Failed to update section");
    }
  },

  // 5. Xóa một section
  async deleteSection(sectionId) {
    try {
      const sectionToDelete = await Section.findById(sectionId);

      if (!sectionToDelete) {
        return { success: false, message: "Section not found" };
      }

      const { course, order } = sectionToDelete;
      // Xóa section
      await Section.findByIdAndDelete(sectionId);
      await Course.findByIdAndUpdate(
        course,
        { $pull: { sections: sectionId } } // Xóa sectionId khỏi trường `sections` của khóa học
      );
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
