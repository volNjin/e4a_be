import mongoose from "mongoose";
import Exercise from "../models/Exercise.js";
import Section from "../models/Section.js";

export const createExercise = async (exerciseData) => {
  try {
    if (exerciseData.type === "choice") {
      const trueOptionsCount = exerciseData.options.filter(
        (option) => option.isCorrect
      ).length;
      if (trueOptionsCount >= 2) {
        exerciseData.type = "multiple-choice";
      } else {
        exerciseData.type = "single-choice";
      }
    }
    if (exerciseData.type === "conversation") {
      if (
        !exerciseData.conversation ||
        exerciseData.conversation.length === 0
      ) {
        return {
          success: false,
          message: "Conversation script is required for conversation type.",
        };
      }
      exerciseData.conversation.script = parseConversation(exerciseData.conversation.script);
    }
    const exercise = new Exercise(exerciseData);
    await exercise.save();
    await Section.findByIdAndUpdate(exercise.sectionId, {
      $push: { exercises: exercise._id },
    });
    return { success: true, exercise: exercise };
  } catch (error) {
    throw error;
  }
};

const parseConversation = (conversationText) => {
  const lines = conversationText.split("\n"); // Split the text into lines
  const script = [];
  let currentSpeaker = null; // Track the current speaker

  lines.forEach((line) => {
    if (!line.trim()) return; // Skip empty lines

    const [speaker, ...textParts] = line.split(":"); // Split by the first colon
    if (textParts.length > 0) {
      // If the line starts with a speaker identifier
      currentSpeaker = speaker.trim(); // Update the current speaker
      script.push({
        speaker: currentSpeaker,
        text: textParts.join(":").trim(), // Join the remaining parts as the text
      });
    } else if (currentSpeaker) {
      // If the line does not start with a speaker, treat it as a continuation
      script[script.length - 1].text += ` ${line.trim()}`; // Append to the last speaker's text
    }
  });
  return script;
};

export const getExerciseById = async (exerciseId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(exerciseId)) {
      throw new Error("Invalid exerciseId");
    }

    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      return { success: false, message: "Exercise not found" };
    }
    return { success: true, exercise: exercise };
  } catch (error) {
    throw error;
  }
};

export const updateExercise = async (exerciseId, updateData) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(exerciseId)) {
      throw new Error("Invalid exerciseId");
    }

    const exercise = await Exercise.findByIdAndUpdate(exerciseId, updateData, {
      new: true,
    });
    if (!exercise) {
      return { success: false, message: "Exercise not found" };
    }
    return { success: true, exercise: exercise };
  } catch (error) {
    throw error;
  }
};

export const deleteExercise = async (exerciseId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(exerciseId)) {
      throw new Error("Invalid exerciseId");
    }

    const exercise = await Exercise.findByIdAndDelete(exerciseId);
    if (!exercise) {
      return { success: false, message: "Exercise not found" };
    }
    await Section.findByIdAndUpdate(exercise.sectionId, {
      $pull: { exercises: exercise._id },
    });
    return { success: true, message: "Exercise deleted successfully" };
  } catch (error) {
    throw error;
  }
};

export const getAllExercises = async () => {
  try {
    const exercises = await Exercise.find();
    return { success: true, exercises: exercises };
  } catch (error) {
    throw error;
  }
};

export const getExercisesBySection = async (sectionId) => {
  try {
    const exercises = await Exercise.find({ sectionId: sectionId });
    if (!exercises.length) {
      return { success: false, message: "No exercises found in this section" };
    }
    return { success: true, exercises: exercises };
  } catch (error) {
    throw error;
  }
};
