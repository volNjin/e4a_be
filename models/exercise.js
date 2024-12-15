import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema(
  {
    video: { type: mongoose.Schema.Types.ObjectId, ref: "Video" }, // Video reference (optional)
    type: {
      type: String,
      enum: ["multiple-choice", "single-choice"], // Type of question
      required: true,
    },
    question: { type: String, required: true }, // The question being asked
    options: [
      {
        text: { type: String, required: true }, // The text of the option
        isCorrect: { type: Boolean, default: false }, // Whether this option is correct
      },
    ],
    correctAnswers: [{ type: Number }], // Indices of the correct answers (for multiple-choice)
    submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Submission" }], // User submissions
  },
  { timestamps: true }
);

export default mongoose.model("Exercise", ExerciseSchema);
