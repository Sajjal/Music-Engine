const { downloadVideo } = require("./downloadVideoAsMp3");
const audioDB = require("./dbConfig");

async function dbSearch(audioID) {
  return audioDB.findOne({ audioID: audioID });
}

async function dbSave(audioID) {
  let data = await downloadVideo(audioID);
  let db = new audioDB(data);
  db.save();
  return data;
}

async function dbOperation(audioID) {
  let searchAudio = await dbSearch(audioID);
  if (searchAudio) {
    return searchAudio;
  } else {
    let newAudio = await dbSave(audioID);
    return newAudio;
  }
}

module.exports = { dbOperation };
