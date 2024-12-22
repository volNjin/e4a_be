import courseService from "../services/courseService.js";

export const getAllCourses = async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyCourses = async (req, res) => {
  try {
    const user = req.user;
    const courses = await courseService.getMyCourses(user);
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await courseService.getCourseById(id);
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getEnrolledUsers = async (req, res) => {
  try {
    const { courseId } = req.params;
    const result = await courseService.getEnrolledUsers(courseId);
    if (!result.success) {
      return res
        .status(result.status)
        .json({ success: false, message: result.message });
    }
    res.status(201).json({ success: true, enrolledUsers: result.data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file; // Extract image path from Multer middleware
    const teacherId = req.user?.id; // Extract teacher ID from token
    // Check for required fields
    if (!title || !description || !teacherId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const result = await courseService.createCourse(
      title,
      description,
      image,
      teacherId
    );
    if (!result.success) {
      return res
        .status(result.status)
        .json({ success: false, message: result.message });
    }
    res.status(201).json({ success: true, data: result.course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, image } = req.body;
    const result = await courseService.updateCourse(
      courseId,
      title,
      description,
      image
    );
    if (!result.success) {
      return res
        .status(result.status)
        .json({ success: false, message: result.message });
    }
    res.status(200).json({ success: true, data: result.course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await courseService.deleteCourse(id);
    if (!result.success) {
      return res
        .status(result.status)
        .json({ success: false, message: result.message });
    }
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
