import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Học viên thực hiện bài tập
    exercise: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise" }, // Bài tập mà học viên nộp
    content: { type: String }, // Nội dung trả lời của học viên
    score: { type: Number }, // Điểm số học viên đạt được
    teacherComment: { type: String }, // Nhận xét của giáo viên về bài làm
  },
  { timestamps: true }
);

export default mongoose.model("Submission", SubmissionSchema);
