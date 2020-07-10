const scrapeYt = require("scrape-yt");

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function scrape_youtube(keyword) {
    let videos = [];
    let videoList = {};
    while (videos.length <= 0) {
        videos = await scrapeYt.search(keyword);
    }
    let videoArr = [];
    for (let i = 0; i < videos.length; i++) {
        let duration = "duration";
        if (
            duration in videos[i] &&
            videos[i].duration <= 600 &&
            videos[i].duration > 200
        ) {
            title = videos[i].title.substring(0, 24).toLowerCase();
            title = capitalizeFirstLetter(title);
            length = parseFloat(videos[i].duration / 60).toFixed(2)
            videoList = {
                title: title,
                audioID: videos[i].id,
                length: length,
                thumbnail: `https://i.ytimg.com/vi/${videos[i].id}/hqdefault.jpg`,
            };
            videoArr.push(videoList)
            if (videoArr.length == 3) return videoArr;
        }
    }
}

module.exports = {scrape_youtube};