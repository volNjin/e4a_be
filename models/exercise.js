import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema(
  {
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "multiple-choice",
        "single-choice",
        "fill-in-the-blank",
        "speaking",
      ],
      required: true,
    },
    question: { type: String, required: true },
    options: [
      {
        text: { type: String, required: true },
        isCorrect: { type: Boolean, default: false },
      },
    ],
    correctAnswers: [{ type: mongoose.Schema.Types.Mixed }],
  },
  { timestamps: true }
);

export default mongoose.model("Exercise", ExerciseSchema);
