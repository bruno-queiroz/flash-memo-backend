import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../app";
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
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: "none",
      secure: true,
    });

    res.cookie("is-user-logged", true, {
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      sameSite: "none",
      secure: true,
    });

    res.json({ isOk: true, msg: "User Created", data: null });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        res.json({
          isOk: false,
          msg: "Name must be unique",
          data: null,
        });
      }
      return;
    }

    res.json({
      isOk: false,
      msg: "User not Created, something went wrong",
      data: null,
    });
  }
};
