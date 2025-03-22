import * as ExerciseService from "../services/exerciseService.js";

export const createExercise = async (req, res) => {
  try {
    const exerciseData = req.body;
    const result = await ExerciseService.createExercise(exerciseData);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getExerciseById = async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const result = await ExerciseService.getExerciseById(exerciseId);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateExercise = async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const updateData = req.body;
    const result = await ExerciseService.updateExercise(exerciseId, updateData);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteExercise = async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const result = await ExerciseService.deleteExercise(exerciseId);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllExercises = async (req, res) => {
  try {
    const result = await ExerciseService.getAllExercises();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getExercisesBySection = async (req, res) => {
    try {
        const { sectionId } = req.params;
        const result = await ExerciseService.getExercisesBySection(sectionId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}