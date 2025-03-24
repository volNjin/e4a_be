import mongoose from "mongoose";
import Exercise from "../models/exercise.js";
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
