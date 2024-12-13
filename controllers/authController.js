import * as authService from "../services/authService.js";

const login = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    console.log(result);
    if (!result.success) {
      return res.status(result.status).json({ message: result.message });
    }

    res.status(200).json(result.data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const result = await authService.register(name, email, password, role);
    if (!result.success) {
      return res.status(result.status).json({ message: result.message });
    }

    res.status(201).json(result.data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    const result = await authService.refreshToken(token);
    if (!result.success) {
      return res.status(result.status).json({ message: result.message });
    }

    res.status(200).json(result.data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export { login, register, refreshToken };
