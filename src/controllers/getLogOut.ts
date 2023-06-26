import { Request, Response } from "express";

export const getLogOut = async (req: Request, res: Response) => {
  res.clearCookie("jwt-token", {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: "none",
    secure: true,
  });

  res.clearCookie("is-user-logged", {
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    sameSite: "none",
    secure: true,
  });

  res.json({ isOk: true, msg: "User Logged out", data: null });
};
