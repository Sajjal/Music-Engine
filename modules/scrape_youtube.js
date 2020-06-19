const yts = require("scrape-youtube").default;

//Search Youtube based on keyword
async function yt_search(keyword) {
  const videos = new Promise((resolve, reject) => {
    yts.search(keyword).then((results) => {
      let videoArr = [];
      for (let i = 0; i < results.length; i++) {
        let duration = "duration";
        if (
          duration in results[i] &&
          results[i].duration <= 600 &&
          results[i].duration > 200
        ) {
          videoArr.push(results[i]);
        }
      }
      resolve(videoArr);
      videoArr = [];
    });
  });
  await videos;
  return videos;
}

//Capitalize the first letter of title.
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function scrape_youtube(keyword) {
  let records = 0;
  while (records <= 0) {
    videos = await yt_search(keyword);
    if (videos.length > 5) records++;
  }

  const videoArr = [];
  let videoList = {};

  //return array of 3 videos < 10 min in length
  let count = 5;
  for (let i = 0; i < count; i++) {
    let length = videos[i].duration;

    title = videos[i].title.substring(0, 24).toLowerCase();
    title = capitalizeFirstLetter(title);
    lengthInMinutes = parseFloat(videos[i].duration / 60).toFixed(2);

    videoList = {
      title: title,
      audioID: videos[i].id,
      length: lengthInMinutes,
      thumbnail: `https://i.ytimg.com/vi/${videos[i].id}/hqdefault.jpg`,
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
