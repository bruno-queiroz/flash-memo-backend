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
    res.json({ isOk: false, msg: "jwt expired", data: null });
  }
};
