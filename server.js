import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import urlRouter from "./routes/urlRout.js";
import { fileURLToPath } from "url";
import path from "path";

// Definir __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

mongoose
  .connect(process.env.DB_URL, {
    serverSelectionTimeoutMS: 5000, // Tiempo de espera para selección del servidor
    socketTimeoutMS: 45000, // Tiempo de espera para operaciones de socket
  })
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

// Middleware de registro
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//* Routes
app.use("/", urlRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
