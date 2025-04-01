import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    url: { type: String, required: true }, // URL của video
    transcript: { type: String }, // Lời thoại của video
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    }, // Section chứa video này
  },
  { timestamps: true }
);

export default mongoose.model("Video", VideoSchema);
