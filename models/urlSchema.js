import mongoose from "mongoose";
import shortid from "shortid";

const Schema = mongoose.Schema;

const shortUrlSchema = new Schema({
  url: {
    type: String,
    require: true,
  },
  short: {
    type: String,
    require: true,
    default: shortid.generate,
  },
  custom: {
    type: String,
    unique: true,
    sparse: true,
  },
  clicks: {
    type: Number,
    require: true,
    default: 0,
  },
});

export default mongoose.model("ShortUrl", shortUrlSchema);
