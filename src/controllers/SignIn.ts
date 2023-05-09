import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import bcrypt from "bcrypt";
import { prisma } from "../app";

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
        data: userFoundOnDatabase.name,
      },
      process.env.JWT_SECRET || "",
      { expiresIn: "1m" }
    );
    res.cookie("jwt-token", jwtToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    res.json({
      isOk: true,
      msg: "Logging to user account",
      data: { name: userFoundOnDatabase.name, id: userFoundOnDatabase.id },
    });
  } catch (err) {
    res.json({ isOk: false, msg: "User not found", data: null });
  }
};
