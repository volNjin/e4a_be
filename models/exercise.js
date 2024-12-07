import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema(
  {
    video: { type: mongoose.Schema.Types.ObjectId, ref: "Video" }, // Video liên quan đến bài tập
    type: {
      type: String,
      enum: ["writing", "speaking", "listening"],
      required: true,
    }, 
    question: { type: String, required: true }, 
    answer: { type: String }, 
    submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Submission" }], 
  },
  { timestamps: true }
);

export default mongoose.model("Exercise", ExerciseSchema);
