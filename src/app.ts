import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { signUp } from "./controllers/signUp";
import { signIn } from "./controllers/signIn";
import cookieParser from "cookie-parser";
import { jwtAuth } from "./middlewares/jwtAuth";
import dotenv from "dotenv";
import { postDeck } from "./controllers/postDeck";
import { getDecks } from "./controllers/getDecks";
import { createCard } from "./controllers/createCard";
import { studyDeck } from "./controllers/studyDeck";
import { patchCardDates } from "./controllers/patchCardDates";
import { searchCard } from "./controllers/searchCard";
import { getSingleCard } from "./controllers/getSingleCard";
import { patchCardContent } from "./controllers/patchCardContent";
import { deleteDeck } from "./controllers/deleteDeck";
import { deleteCard } from "./controllers/deleteCard";
import { getLogOut } from "./controllers/getLogOut";
import { patchRenameDeck } from "./controllers/patchRenameDeck";
import { corsOptions } from "./config/cors";

dotenv.config();
export const prisma = new PrismaClient();

export const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cors(corsOptions));
  app.use(cookieParser());

  app.post("/sign-up", signUp);
  app.post("/sign-in", signIn);
  app.post("/deck", jwtAuth, postDeck);
  app.post("/card", jwtAuth, createCard);

  app.get("/deck", jwtAuth, getDecks);
  app.get("/deck/:deckName", jwtAuth, studyDeck);
  app.get("/card/:deckId/:cardQuery", jwtAuth, searchCard);
  app.get("/card/:cardId", jwtAuth, getSingleCard);
  app.get("/log-out", getLogOut);

  app.patch("/card-date/:cardId", jwtAuth, patchCardDates);
  app.patch("/card-content/:cardId", jwtAuth, patchCardContent);
  app.patch("/deck/:deckId", jwtAuth, patchRenameDeck);

  app.delete("/deck/:deckId", jwtAuth, deleteDeck);
  app.delete("/card/:cardId", jwtAuth, deleteCard);

  return app;
};
