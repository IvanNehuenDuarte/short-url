import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import urlRouter from "./routes/urlRout.js";

const app = express();

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("Database connection error:", error);
});
db.once("open", () => {
  console.log("Database connected successfully");
});

db.on("error", (error) => {
  console.log(error);
});
db.once("open", () => {
  console.log("Connected");
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//* Routes
app.use("/", urlRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT);
