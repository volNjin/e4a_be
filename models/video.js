import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Tiêu đề video
    url: { type: String, required: true }, // URL của video
    transcript: { type: String }, // Lời thoại của video
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    }, // Section chứa video này
    exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exercise" }], // Các bài tập liên quan đến video này
  },
  { timestamps: true }
);

export default mongoose.model("Video", VideoSchema);
