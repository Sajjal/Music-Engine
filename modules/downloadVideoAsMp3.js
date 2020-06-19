const ytdl = require("ytdl-core");
let YoutubeMp3Downloader = require("youtube-mp3-downloader");

//get video information
async function videoInfo(videoID) {
  let videoInfo = await ytdl.getBasicInfo(videoID);
  let title = videoInfo.title.substring(0, 25).replace(/[^A-Z0-9]+/gi, "_");
  let length = videoInfo.length_seconds;
  let url = `https://www.youtube.com/watch?v=${videoID}`;
  let thumbnail = `https://i.ytimg.com/vi/${videoID}/hqdefault.jpg`;

  let relatedVideos = videoInfo.related_videos;

  //Filter related video by length. Only get related videos with that is less than 10 Minutes long.
  let related = () => {
    for (let i = 0; i < relatedVideos.length; i++) {
      if (
        relatedVideos[i].length_seconds > 200 &&
        relatedVideos[i].length_seconds < 600
      )
        return relatedVideos[i].id;
    }
  };

  lengthInMinutes = parseFloat(length / 60).toFixed(2);

  data = {
    audioID: videoID,
    title: title,
    length: lengthInMinutes,
    url: url,
    image: thumbnail,
    related: related(),
  };
  return data;
}

async function downloadVideo(videoID) {
  data = await videoInfo(videoID);

  let YD = new YoutubeMp3Downloader({
    ffmpegPath: "/usr/local/bin/ffmpeg", //path to ffmpeg
    outputPath: "./public/assets/",
    youtubeVideoQuality: "lowest",
    queueParallelism: 2,
    progressTimeout: 2000,
  });

  //Download video and save as MP3 file
  YD.download(data.audioID, `${data.title}.mp3`);
  const after = new Promise((resolve, reject) => {
    YD.on("finished", function (err, done) {
      if (err) reject(err);
      resolve(done);
    });
  });
  await after;
  return data;
}

module.exports = { downloadVideo };
