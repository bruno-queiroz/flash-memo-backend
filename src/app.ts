import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { signUp } from "./controllers/SignUp";

export const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

app.post("/sign-up", signUp);

app.listen(3000, () => {
  console.log("running");
});
