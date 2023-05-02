import express from "express";

const app = express();

app.listen(3000, () => {
  console.log("running");
});

app.get("/", (req, res) => {
  res.send("hello world!!!!!!!!!!");
});
