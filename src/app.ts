import express from "express";
import cors, { CorsOptions } from "cors";
import { PrismaClient } from "@prisma/client";
import { signUp } from "./controllers/SignUp";
import { signIn } from "./controllers/SignIn";

export const prisma = new PrismaClient();
const app = express();

const allowedUrls = ["http://localhost:5173"];
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

app.post("/sign-up", signUp);
app.post("/sign-in", signIn);

app.listen(3000, () => {
  console.log("running");
});
