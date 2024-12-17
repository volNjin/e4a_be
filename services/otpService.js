import Otp from "../models/otp.js";
import { generateToken } from "../helpers/randomToken.js";
const newOtp = async (email) => {
  // check otp exist
  try {
    const otp = generateToken();
    const expireAt = new Date();
    expireAt.setMinutes(expireAt.getMinutes() + 5);
    const newOTP = await Otp.updateOne(
      { email: email }, // Find the document based on the email
      {
        $set: {
          otp: otp, // Update the OTP
          expireAt: expireAt, // Update the expiration date
        },
      },
      { upsert: true } // If the document doesn't exist, create a new one
    );
    return otp;
  } catch (err) {
    throw new Error("Error creating new otp: " + err.message);
  }
};

const verifyOtp = async (email, otp) => {
  try {
    // Find the OTP document where email and otp match
    const otpRecord = await Otp.findOne({ email: email, otp: otp });

    // Check if OTP exists
    if (!otpRecord) {
      return { success: false, message: "Invalid OTP" };
    }

    // Check if the OTP has expired
    if (new Date() > otpRecord.expireAt) {
      return { success: false, message: "OTP has expired" };
    }

    // Optionally, delete the OTP to prevent reuse (for better security)
    await Otp.deleteOne({ email: email, otp: otp });

    return { success: true, message: "Otp verification successful" };
  } catch (err) {
    throw new Error(err.message);
  }
};

export { newOtp, verifyOtp };
