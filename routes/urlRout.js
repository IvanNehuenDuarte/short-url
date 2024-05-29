import express from "express";
import ShortUrl from "../models/urlSchema.js";
import shortid from "shortid";

const router = express.Router();

// Función para validar la URL personalizada
const isValidCustomUrl = (customUrl) => {
  const regex = /^[a-zA-Z0-9-_]{3,30}$/;
  return regex.test(customUrl);
};

router.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();

  res.render("index", { shortUrls: shortUrls });
});

router.post("/shortUrls", async (req, res) => {
  const { url, custom } = req.body;

  if (custom) {
    // Validar la URL personalizada
    if (!isValidCustomUrl(custom)) {
      return res.status(400).json({ message: "Invalid custom URL format" });
    }

    // Verificar si la URL personalizada ya existe
    const existingCustomUrl = await ShortUrl.findOne({ custom });
    if (existingCustomUrl) {
      return res.status(400).json({ message: "Custom URL already exists" });
    }
  }

  // Crear la nueva URL corta
  const newShortURL = new ShortUrl({
    url: url,
    customUrl: custom || null,
    short: custom || shortid.generate(),
  });

  await newShortURL.save();
  console.log("Short URL Created", newShortURL);
  res.redirect("/");
});

router.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({
    $or: [{ short: req.params.shortUrl }, { customUrl: req.params.shortUrl }],
  });

  if (shortUrl == null) {
    return res.sendStatus(404);
  }

  shortUrl.clicks++;
  await shortUrl.save();
  res.redirect(shortUrl.url);
});

router.get("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await ShortUrl.deleteOne({ _id: id });
    console.log("Delete");
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

export default router;
