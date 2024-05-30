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
  try {
    const shortUrls = await ShortUrl.find();
    res.render("index", { shortUrls: shortUrls });
  } catch (error) {
    console.error("Error fetching short URLs:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/shortUrls", async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Error creating short URL:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:shortUrl", async (req, res) => {
  try {
    const shortUrl = await ShortUrl.findOne({
      $or: [{ short: req.params.shortUrl }, { customUrl: req.params.shortUrl }],
    });

    if (shortUrl == null) {
      return res.sendStatus(404);
    }

    shortUrl.clicks++;
    await shortUrl.save();
    res.redirect(shortUrl.url);
  } catch (error) {
    console.error("Error finding short URL:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await ShortUrl.deleteOne({ _id: id });
    console.log("Delete");
    res.redirect("/");
  } catch (error) {
    console.error("Error deleting short URL:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
