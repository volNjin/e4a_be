import transporter from "../config/nodemailer.js";
import createUserTemplate from "../utils/createUserTemp.js";
import changePasswordTemplate from "../utils/changePasswordTemp.js";
import otpEmailTemp from "../utils/otpEmailTemp.js";
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

  static async changePasswordNotification(toEmail, username) {
    try {
      const mailOptions = {
        from: '"E4A Club" <e4aclub@gmail.com>', // Sender address
        to: toEmail, // Recipient
        subject: "Your Password Has Been Changed",
        html: changePasswordTemplate(username, toEmail), // Gọi hàm tạo nội dung email
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
  static async sendOtpEmail(toEmail, otp) {
    try {
      const mailOptions = {
        from: '"E4A Club" <e4aclub@gmail.com>', // Sender address
        to: toEmail, // Recipient
        subject: "Your OTP to reset your password",
        html: otpEmailTemp(otp, toEmail), // Gọi hàm tạo nội dung email
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
