import express from "express";
import cors, { CorsOptions } from "cors";
import { PrismaClient } from "@prisma/client";
import { signUp } from "./controllers/signUp";
import { signIn } from "./controllers/signIn";
import cookieParser from "cookie-parser";
import { jwtAuth } from "./middlewares/jwtAuth";
import dotenv from "dotenv";
import { createDeck } from "./controllers/createDeck";

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
app.post("/create-deck", jwtAuth, createDeck);

app.listen(3000, () => {
  console.log("running");
});
