const mongoose = require("mongoose");

const audioSchema = new mongoose.Schema({
  audioID: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  related: {
    type: String,
    required: true,
  },
});

audioSchema.index({ audioID: "audioID" });

module.exports = mongoose.model("audioDB", audioSchema);
