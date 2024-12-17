import crypto from "crypto";

export const generateToken = () => {
  // Generate 3 random bytes
  const randomBytes = crypto.randomBytes(3);
  // Convert the bytes to an integer
  const token = randomBytes.readUIntBE(0, 3) % 1000000;
  // Convert the integer to a string and pad it with leading zeros if necessary
  return token.toString().padStart(6, "0");
};
