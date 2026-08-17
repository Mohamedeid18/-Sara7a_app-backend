import { randomInt } from "node:crypto";

export const generateOTP = () => {
  const otp = randomInt(100000, 999999).toString();
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000); 

  return { otp, otpExpires };
};