import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import bcrypt from "bcrypt";
import { prisma } from "../app";

export const signUp = async (req: Request, res: Response) => {
  const userSignUpData = req.body;

  const hash = await bcrypt.hash(userSignUpData.password, 10);

  await prisma.user.create({
    data: {
      name: userSignUpData.name,
      password: hash,
    },
  });

  res.json({ msg: "user created" });
};
