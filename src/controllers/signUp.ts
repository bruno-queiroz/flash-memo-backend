import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../../lib/client";
import { Prisma } from "@prisma/client";

export const signUp = async (req: Request, res: Response) => {
  const userSignUpData = req.body;

  try {
    const hash = await bcrypt.hash(userSignUpData.password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: userSignUpData.name,
        password: hash,
      },
    });

    const jwtToken = jwt.sign(
      {
        userName: newUser.name,
        userId: newUser.id,
      },
      process.env.JWT_SECRET || "",
      { expiresIn: "7d" }
    );

    res.cookie("jwt-token", jwtToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "none",
      secure: true,
    });

    res.status(200).json({
      isOk: true,
      msg: "User Created",
      data: { name: newUser.name, id: newUser.id },
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      res.status(400).json({
        isOk: false,
        msg: "Name must be unique",
        data: null,
      });
      return;
    }

    res.status(500).json({
      isOk: false,
      msg: "User not Created, something went wrong",
      data: null,
    });
  }
};
