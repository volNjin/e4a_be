import Section from "../models/section.js";
import Course from "../models/course.js";
import Video from "../models/video.js";
import mongoose from "mongoose";
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
      console.error(error);
      return res.status(500).json({ message: error.message });
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
      });

      await newSection.save();

      const newVideo = new Video({ url: video, section: newSection._id });
      await newVideo.save();

      newSection.video = newVideo.url;
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
        { _id: 1, title: 1 }
      ).sort({
        order: 1,
      }); // Sắp xếp theo thứ tự
      return sections;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch sections");
    }
  },
  // 3. Lấy thông tin section theo id
  async getSection(sectionId) {
    try {
      const section = await Section.findById(sectionId);
      if (!section) {
        throw new Error("Section not found");
      }

      return section;
    } catch (error) {
      console.error("Error fetching section: ", error);
      throw new Error("Failed to fetch section");
    }
  },
  // // 3. Lấy tất cả sections con của một section, có phân loại theo thứ tự
  // async getSectionsByParent(parentId) {
  //   try {
  //     const sections = await Section.find({ parent: parentId }).sort({
  //       order: 1,
  //     }); // Sắp xếp theo thứ tự
  //     return sections;
  //   } catch (error) {
  //     throw new Error("Failed to fetch sections");
  //   }
  // },

  // 4. Cập nhật một section
  async updateSection(sectionId, title, content, order, videoUrl) {
    try {
      const sectionToUpdate = await Section.findById(sectionId);
      if (!sectionToUpdate) {
        throw new Error("Section not found");
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

      // Cập nhật thông tin video
      const sectionObjectId = new mongoose.Types.ObjectId(sectionId);
      const oldVideo = await Video.findOne({ section: sectionObjectId });
      oldVideo.url = videoUrl;
      await oldVideo.save();

      // Cập nhật thông tin của Section
      const updatedSection = await Section.findByIdAndUpdate(
        sectionId,
        { title, content, order, video: oldVideo._id },
        { new: true }
      );

      return updatedSection;
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
