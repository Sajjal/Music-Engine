const yts = require("yt-search");

async function yt_search(keyword) {
  const videos = new Promise((resolve, reject) => {
    yts(keyword, function (err, r) {
      const videos = r.videos;
      let videoArr = [];
      for (let i = 0; i < videos.length; i++) {
        let seconds = "seconds";
        if (
          seconds in videos[i] &&
          videos[i].seconds <= 600 &&
          videos[i].seconds > 200
        ) {
          videoArr.push(videos[i]);
        }
      }
      resolve(videoArr);
    });
  });
  await videos;
  return videos;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function scrape_youtube(keyword) {
  let videos = [];
  while (videos.length <= 0) {
    videos = await yt_search(keyword);
  }

  const videoArr = [];
  let videoList = {};
  let count = 3;

  for (let i = 0; i < count; i++) {
    title = videos[i].title.substring(0, 24).toLowerCase();
    title = capitalizeFirstLetter(title);

    videoList = {
      title: title,
      audioID: videos[i].videoId,
      length: videos[i].timestamp,
      thumbnail: `https://i.ytimg.com/vi/${videos[i].videoId}/hqdefault.jpg`,
    };

    videoArr.push(videoList);

    if (videoArr.length == 3) {
      videos = [];
      return videoArr;
    }
    count++;
  }
}

module.exports = { scrape_youtube };
