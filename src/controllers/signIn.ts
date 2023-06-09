import { Request, Response } from "express";
import jwt from "jsonwebtoken";
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
        userName: userFoundOnDatabase.name,
        userId: userFoundOnDatabase.id,
      },
      process.env.JWT_SECRET || "",
      { expiresIn: "10s" }
    );
    res.cookie("jwt-token", jwtToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    });

    res.cookie("is-user-logged", true, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    });

    res.json({
      isOk: true,
      msg: "Logged to user account",
      data: { name: userFoundOnDatabase.name, id: userFoundOnDatabase.id },
    });
  } catch (err) {
    res.json({ isOk: false, msg: "User not found", data: null });
  }
};
