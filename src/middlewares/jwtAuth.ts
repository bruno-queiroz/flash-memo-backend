import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
  const jwtToken = req.cookies["jwt-token"];
  try {
    var decoded = jwt.verify(jwtToken, process.env.JWT_SECRET || "");
    next();
  } catch (err) {
    res.json({ isOk: false, msg: "jwt expired", data: null });
  }
};
