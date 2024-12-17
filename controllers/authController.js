import * as authService from "../services/authService.js";
import mailService from "../services/mailService.js";
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
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

    // Step 1: Call the authService to create the user
    const result = await authService.register(name, email, password, role);
    if (!result.success) {
      return res.status(result.status).json({ message: result.message });
    }

    // Step 2: Send welcome email to the user
    try {
      await mailService.sendWelcomeEmail(email, name, password);
      console.log("Welcome email sent successfully");
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      // Optional: You can choose to continue, log it, or notify an admin
    }

    // Step 3: Return a response to the client
    res.status(201).json(result.data);
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export { login, register };
