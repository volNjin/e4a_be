import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Tên khóa học
    description: { type: String }, // Mô tả khóa học
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Giáo viên phụ trách khóa học
    sections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }], // Các section (phần) trong khóa học
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);
