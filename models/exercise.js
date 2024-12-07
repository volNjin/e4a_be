import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema(
  {
    video: { type: mongoose.Schema.Types.ObjectId, ref: "Video" }, // Video liên quan đến bài tập
    type: {
      type: String,
      enum: ["remember", "speaking", "listening"],
      required: true,
    }, // Loại bài tập (Ghi nhớ, Luyện nói, Luyện nghe)
    question: { type: String, required: true }, // Câu hỏi bài tập
    answer: { type: String }, // Đáp án đúng
    submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Submission" }], // Các bài làm của học viên
  },
  { timestamps: true }
);

export default mongoose.model("Exercise", ExerciseSchema);
