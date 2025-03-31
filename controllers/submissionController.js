import * as SubmissionService from "../services/submissionService.js";

export const createSubmission = async (req, res) => {
  try {
    const userId = req.user.id;
    const submissionData = { ...req.body, userId };
    const result = await SubmissionService.createSubmission(submissionData);
    if (!result.success) {
      return res.status(400).json({success: false, message: "Failed to create submission"});
    }
    res.status(201).json({success: true, message: "Submission created successfully", submission: result.submission});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSubmissionById = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const result = await SubmissionService.getSubmissionById(submissionId);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const updateData = req.body;
    const result = await SubmissionService.updateSubmission(submissionId, updateData);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const result = await SubmissionService.deleteSubmission(submissionId);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllSubmissions = async (req, res) => {
  try {
    const result = await SubmissionService.getAllSubmissions();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};