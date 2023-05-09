import express from "express";
import cors, { CorsOptions } from "cors";
import { PrismaClient } from "@prisma/client";
import { signUp } from "./controllers/SignUp";
import { signIn } from "./controllers/SignIn";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

export const prisma = new PrismaClient();
const app = express();

const allowedUrls = ["http://localhost:5173", "http://localhost:3000"];
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (allowedUrls.indexOf(origin || "") !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
dotenv.config();

app.post("/sign-up", signUp);
app.post("/sign-in", signIn);

app.listen(3000, () => {
  console.log("running");
});
