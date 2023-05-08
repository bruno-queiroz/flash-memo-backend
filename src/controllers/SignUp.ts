import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import bcrypt from "bcrypt";
import { prisma } from "../app";

export const signUp = async (req: Request, res: Response) => {
  const userSignUpData = req.body;

  try {
    const hash = await bcrypt.hash(userSignUpData.password, 10);

    await prisma.user.create({
      data: {
        name: userSignUpData.name,
        password: hash,
      },
    });

    res.json({ isOk: true, msg: "User Created", data: null });
  } catch (err) {
    res.json({
      isOk: false,
      msg: "User not Created, something went wrong",
      data: null,
    });
  }
};
