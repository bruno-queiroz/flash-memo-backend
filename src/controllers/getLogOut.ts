import { Request, Response } from "express";

export const getLogOut = async (req: Request, res: Response) => {
  res.clearCookie("jwt-token");
  res.clearCookie("is-user-logged");
  res.json({ isOk: true, msg: "User Logged out", data: null });
};
