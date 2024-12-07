import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Tiêu đề section
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Section" }, // Mối quan hệ cha con
    order: { type: Number, required: true }, // Thứ tự của section trong khóa học
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    }, // Khóa học chứa section này
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }], // Video liên quan đến section
    exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exercise" }], // Bài tập liên quan đến section
  },
  { timestamps: true }
);

export default mongoose.model("Section", SectionSchema);
