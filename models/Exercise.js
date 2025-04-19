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
        "conversation",
      ],
      required: true,
    },
    question: { type: String, required: true },
    options: [
      {
        text: { type: String },
        isCorrect: { type: Boolean, default: false },
      },
    ],
    blankAnswer: { type: String },
    conversation: {
      role: {type: String, required: true}, 
      script: { type: String, required: true },
      parsedScript: [
        {
          speaker: String, 
          text: String,
        },
      ],
    },
  },
  { timestamps: true }
);

ExerciseSchema.pre("validate", function (next) {
  if (this.type === "multiple-choice" || this.type === "single-choice") {
    if (!this.options || this.options.length === 0) {
      return next(new Error("Options are required for choice-based questions."));
    }
  }

  if (this.type === "fill-in-the-blank") {
    if (!this.blankAnswer || this.blankAnswer.trim() === "") {
      return next(new Error("Blank answer is required for fill-in-the-blank questions."));
    }
  }

  next();
});

export default mongoose.model("Exercise", ExerciseSchema);
