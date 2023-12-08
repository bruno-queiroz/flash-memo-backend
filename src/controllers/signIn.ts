import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../../lib/client";

interface ClientBodyRequest {
  name: string;
  password: string;
}

export const signIn = async (req: Request, res: Response) => {
  const userSignInData: ClientBodyRequest = req.body;
  try {
    const userFoundOnDatabase = await prisma.user.findUniqueOrThrow({
      where: {
        name: userSignInData.name,
      },
    });

    const matchUserPassword = await bcrypt.compare(
      userSignInData.password,
      userFoundOnDatabase.password
    );

    if (!matchUserPassword) {
      res.json({ isOk: false, msg: "Password Incorrect", data: null });
      return;
    }

    const jwtToken = jwt.sign(
      {
        userName: userFoundOnDatabase.name,
        userId: userFoundOnDatabase.id,
      },
      process.env.JWT_SECRET || "",
      { expiresIn: "7d" }
    );
    res.cookie("jwt-token", jwtToken, {
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      sameSite: "none",
      secure: true,
    });

    res.json({
      isOk: true,
      msg: "Logged to user account",
      data: { name: userFoundOnDatabase.name, id: userFoundOnDatabase.id },
    });
  } catch (err) {
    console.error("Error signing in user", err);
    res.json({ isOk: false, msg: "User not found", data: null });
  }
};
