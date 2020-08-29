const express = require("express");
const router = express.Router();
const { dbOperation } = require("../modules/dbOperation");
const { scrape_youtube } = require("../modules/scrape_youtube");
const fs = require("fs");
const assets = "public/assets";

router
  .post("/search", async (req, res) => {
    let searchText = req.body.search.toLowerCase();
    let audioList = await scrape_youtube(searchText);
    return res.json({ result: audioList });
    //res.render("index", { audioList: audioList });
  })
  .post("/play", async (req, res) => {
    let audioID = req.body.play;
    await streamAudio(audioID);
    let audio = await dbOperation(audioID);
    return res.json({ audio: audio });
    //return res.render("play", { audio: audio });
  });

/****************** Stream Audio *********************/
async function streamAudio(audioID) {
  router.get(`/play/${audioID}`, async (req, res) => {
    let audio = await dbOperation(audioID);
    let path = "";
    path = `${assets}/${audio.title}.mp3`;

    fs.stat(path, (err, stat) => {
      if (err !== null && err.code === "ENOENT") {
        res.sendStatus(404);
      }
      const fileSize = stat.size;
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");

        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        const chunksize = end - start + 1;
        const file = fs.createReadStream(path, { start, end });
        const head = {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": "audio/mpeg",
        };

        res.writeHead(206, head);
        file.pipe(res);
      } else {
        const head = {
          "Content-Length": fileSize,
          "Content-Type": "audio/mpeg",
        };

        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res);
      }
    });
  });
}

module.exports = router;
