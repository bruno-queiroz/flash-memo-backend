import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface CustomPayloadData {
  userName?: string;
  userId?: string;
}

type CustomJwtPayload = string | (jwt.JwtPayload & CustomPayloadData);

export const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
  const jwtToken = req.cookies["jwt-token"];
  try {
    const decoded: CustomJwtPayload = jwt.verify(
      jwtToken,
      process.env.JWT_SECRET || ""
    );
    req.body.userName = (decoded as CustomPayloadData)?.userName;
    req.body.userId = (decoded as CustomPayloadData)?.userId;

    next();
  } catch (err) {
    res.cookie("is-user-logged", false, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    });
    res.json({ isOk: false, msg: "Session expired", data: null });
  }
};
