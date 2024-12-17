import transporter from "../config/nodemailer.js";
import createUserTemplate from "../utils/create_user_html.js";

class mailService {
  static async sendWelcomeEmail(toEmail, username, password) {
    try {
      const mailOptions = {
        from: '"E4A Club" <e4aclub@gmail.com>', // Sender address
        to: toEmail, // Recipient
        subject: "Welcome to E4A Club - Your Account Information", // Subject line
        html: createUserTemplate(username, toEmail, password), // HTML body content
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: %s", info.messageId);

      return {
        success: true,
        message: "Email sent successfully",
        messageId: info.messageId,
      };
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  }
}

export default mailService;
