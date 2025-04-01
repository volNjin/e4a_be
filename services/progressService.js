import mongoose from "mongoose";
import Progress from "../models/Progress.js";
import Course from "../models/Course.js";

export const getAllProgress = async (userId) => {
  try {
    const progress = await Progress.find({ userId });
    return progress;
  } catch (error) {
    throw error;
  }
};

export const getProgress = async (userId, courseId) => {
  try {
    const progress = await Progress.findOne({ userId, courseId });
    if (!progress) {
      return { success: false, message: "Progress not found" };
    }
    return { success: true, progress: progress };
  } catch (error) {
    throw error;
  }
};

export const initProgress = async (userId, courseId) => {
  try {
    const progress = await Progress.findOne({ userId, courseId });
    if (progress) {
      return { success: false, message: "Progress already exists" };
    }
    const newProgress = new Progress({ userId, courseId });
    await newProgress.save();
    return { success: true, newProgress };
  } catch (error) {
    throw error;
  }
};

export const markLastAccessedSection = async (userId, courseId, sectionId) => {
  try {
    const updatedProgress = await Progress.findOneAndUpdate(
      { userId, courseId },
      { lastAccessedSection: sectionId, lastAccessedAt: Date.now() },
      { new: true }
    );
  } catch (error) {
    throw error;
  }
};

export const updateProgressOnExerciseSubmission = async (
  userId,
  courseId,
  exerciseId,
  score
) => {
  try {
    // Find the progress document
    const progress = await Progress.findOne({ userId, courseId });
    if (!progress) {
      throw new Error("Progress not found");
    }

    // Check if the exercise already exists in the progress
    const exerciseIndex = progress.exercises.findIndex(
      (ex) => ex.exerciseId.toString() === exerciseId
    );

    if (exerciseIndex !== -1) {
      // Update the score if the exercise exists
      progress.exercises[exerciseIndex].score = score;
    } else {
      // Add the exercise to the progress if it doesn't exist
      progress.exercises.push({ exerciseId, score });
    }

    // Save the updated progress document
    await progress.save();

    // Recalculate the overall progress
    try {
      const calculatedProgress = await calculateProgress(userId, courseId);
      return calculatedProgress;
    } catch (error) {
      console.error("Failed to calculate progress:", error.message);
      throw new Error("Progress calculation failed");
    }
  } catch (error) {
    console.error(
      "Error updating progress on exercise submission:",
      error.message
    );
    throw error;
  }
};

export const updateProgressOnSectionCompletion = async (
  userId,
  courseId,
  sectionId
) => {
  try {
    // Find the progress document
    const progress = await Progress.findOne({ userId, courseId });
    if (!progress) {
      throw new Error("Progress not found");
    }
    // Check if the section already exists in the progress
    const sectionIndex = progress.sections.findIndex(
      (sec) => sec.sectionId.toString() === sectionId.toString()
    );

    if (sectionIndex !== -1) {
      // Update the completedAt timestamp if the section exists
      progress.sections[sectionIndex].completedAt = new Date();
    } else {
      // Add the section to the progress if it doesn't exist
      progress.sections.push({ sectionId, completedAt: new Date() });
    }

    // Save the updated progress document
    await progress.save();

    // Update the last accessed section
    try {
      await markLastAccessedSection(userId, courseId, sectionId);
    } catch (error) {
      console.error("Failed to mark last accessed section:", error.message);
    }

    // Recalculate the overall progress
    try {
      const calculatedProgress = await calculateProgress(userId, courseId);
      return calculatedProgress;
    } catch (error) {
      console.error("Failed to calculate progress:", error.message);
      throw new Error("Progress calculation failed");
    }
  } catch (error) {
    console.error(
      "Error updating progress on section completion:",
      error.message
    );
    throw error;
  }
};

const calculateProgress = async (userId, courseId) => {
  try {
    const progress = await Progress.findOne({ userId, courseId });
    const course = await Course.findById(courseId).populate({
      path: "sections",
      populate: {
        path: "exercises",
      },
    });

    if (!progress || !course) {
      throw new Error("Progress or Course not found");
    }

    const totalSections = course.sections.length;
    const totalExercises = course.sections.reduce(
      (acc, section) => acc + section.exercises.length,
      0
    );
    const completedSections = progress.sections.length;
    const completedExercises = progress.exercises.length;
    const totalItems = totalSections + totalExercises;
    const completedItems = completedSections + completedExercises;

    const progressPercentage = (completedItems / totalItems) * 100;
    progress.progress = progressPercentage;
    await progress.save();
    return progress;
  } catch (error) {
    throw error;
  }
};
