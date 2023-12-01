import { Request, Response } from "express";

export const getLogOut = async (req: Request, res: Response) => {
  res.clearCookie("jwt-token", {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({ isOk: true, msg: "User Logged out", data: null });
};
