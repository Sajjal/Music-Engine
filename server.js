const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { scrape_youtube } = require("./modules/scrape_youtube");
const randomText = require("./modules/suggestRandom");

const musicRouter = require("./routes/music-router");
const app = express();

const publicDirectoryPath = path.join(__dirname, "./public");

app.use(express.static(publicDirectoryPath));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/audioDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let port = process.env.PORT || 3400;

app.use("/", musicRouter);

app.get("*", async function (req, res) {
  return res.render("index");
});

app.post("/", async (req, res) => {
  let randomAudio = await randomText.suggestRandomString();
  let audioList = await scrape_youtube(randomAudio);
  return res.json({ result: audioList });
});

app.listen(port, function () {
  return console.log(`Listening on localhost:${port}`);
});
