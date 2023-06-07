import express from "express";
import cors, { CorsOptions } from "cors";
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
app.post("/create-deck", jwtAuth, postDeck);
app.post("/create-card", jwtAuth, createCard);

app.get("/get-decks", jwtAuth, getDecks);
app.get("/study-deck/:deckName", jwtAuth, studyDeck);
app.get("/search-cards/:deckId/:cardQuery", jwtAuth, searchCard);
app.get("/get-single-card/:cardId", jwtAuth, getSingleCard);
app.get("/get-log-out", getLogOut);

app.patch("/patch-card-dates/:cardId", jwtAuth, patchCardDates);
app.patch("/patch-card-content/:cardId", jwtAuth, patchCardContent);
app.patch("/rename-deck/:deckId", jwtAuth, patchRenameDeck);

app.delete("/delete-deck/:deckId", jwtAuth, deleteDeck);
app.delete("/delete-card/:cardId", jwtAuth, deleteCard);

app.listen(3000, () => {
  console.log("running");
});
