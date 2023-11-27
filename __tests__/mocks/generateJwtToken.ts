import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateJwtToken = () => {
  return jwt.sign(
    {
      userName: "test",
      userId: "123",
    },
    process.env.JWT_SECRET || "",
    { expiresIn: "7d" }
  );
};
