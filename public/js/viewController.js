/********** Select Dom Elements *************/

function getElement(name) {
  return document.querySelector(`#${name}`);
}

//Page Elements
const searchFrom = getElement("form");
const audioListElement = getElement("audioList");
const audioPlayer = getElement("audioPlayer");
const loadingIcon = getElement("loading");
const gotoHome = getElement("gotoHome");

// Messages
const errorMessage = getElement("error");

// Global Variables
let audioTrack = "";
let currentTrack = "";
let previousTrack = "";

/**************** Functions *********************/

//Initial View Screen
async function initialView(API_URL) {
  errorMessage.style.display = "none";
  audioPlayer.style.display = "none";
  loadingIcon.style.display = "";

  try {
    audioTrack.pause();
  } catch {}

  let response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
  });
  response = await response.json();
  audioList = response.result;

  if (!audioList) {
    errorMessage.style.display = "";
    audioListElement.style.display = "none";
  } else {
    errorMessage.style.display = "none";
    audioListElement.style.display = "";
    html = renderHTML(audioList);
    audioListElement.innerHTML = html;
  }
  loadingIcon.style.display = "none";
}
initialView("/");

// Search Music
async function search(API_URL) {
  loadingIcon.style.display = "";
  audioListElement.style.display = "none";

  const searchData = new FormData(searchFrom);
  const search = searchData.get("search");
  const data = { search };

  let response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  });
  response = await response.json();
  audioList = response.result;

  audioPlayer.style.display = "none";
  try {
    audioTrack.pause();
  } catch {}

  if (!audioList) {
    errorMessage.style.display = "";
    audioListElement.style.display = "none";
  } else {
    errorMessage.style.display = "none";
    audioListElement.style.display = "";
    html = renderHTML(audioList);
    audioListElement.innerHTML = html;
  }
  loadingIcon.style.display = "none";
  searchFrom.reset();
}

//Stream Audio
async function playAudio(value) {
  if (value) {
    currentTrack = value;

    try {
      audioTrack.pause();
    } catch {}

    loadingIcon.style.display = "";
    errorMessage.style.display = "none";
    audioListElement.style.display = "none";
    audioPlayer.style.display = "";

    let response = await fetch("/play", {
      method: "POST",
      body: JSON.stringify({ play: value }),
      headers: {
        "content-type": "application/json",
      },
    });
    response = await response.json();
    audio = response.audio;

    html = renderAudioPlayer(audio);

    audioTrack = new Audio(`/play/${audio.audioID}`);
    audioTrack.autoplay = true;
    audioPlayer.innerHTML = html;
    loadingIcon.style.display = "none";

    $(".trigger").click(function () {
      if (audioTrack.paused == false) {
        audioTrack.pause();
        $(".fa-play").show();
        $(".fa-pause").hide();
        $(".music-card").removeClass("playing");
      } else {
        audioTrack.play();
        $(".fa-pause").show();
        $(".fa-play").hide();
        $(".music-card").addClass("playing");
      }
    });

    audioTrack.addEventListener("ended", next, false);
    function next(e) {
      playNext(audio.related);
    }
  }
}

//Play Next Track
function playNext(value) {
  previousTrack = currentTrack;
  playAudio(value);
}

/**************** Event Listeners ***********/

searchFrom.addEventListener("submit", (event) => {
  event.preventDefault();
  search("/search");
});

gotoHome.addEventListener("click", (event) => {
  initialView("/");
});

/**************** Render HTML ***********/

function renderHTML(audioList) {
  const html = ejs.render(
    `<% audioList.forEach(audio => { %>
          <div class="posts">
          <div class="post-thumb">
            <img src="<%=audio.thumbnail%>" />
          </div>
          <div class="post-content">
            <strong><%=audio.title%></strong><br />
            Duration: <%=audio.length%>
          </div>
          <button class="btn-play" value="<%=audio.audioID%>" onclick="playAudio(this.value)">
            <img src="/images/play.png" height="65px" width="70px" />
            </button>
        </div>
      <% }) %>`,
    { audioList: audioList }
  );
  return html;
}

function renderAudioPlayer(audio) {
  const html = ejs.render(
    `<div class="music-card playing">
        <div class="image" style="background: url(<%=audio.image%>) no-repeat 75%;"> </div>

            <div class="wave"></div>
            <div class="wave"></div>
            <div class="wave"></div>

            <div class="info">
                 <h2 class="title"> 
                 <marquee behavior="scroll" direction="left" scrollamount="15">
                <%=audio.title%>
                </marquee>
                </h2>
                <div class="artist"><%=audio.length%></div>
            </div>

            <i class="fa fa-pause trigger" aria-hidden="true"></i>
            <i class="fa fa-play trigger" aria-hidden="true"></i>
    </div>

    <center>
        <div class="Column"> <input type="button" class="btn" value="<< Prev" onclick="playAudio(previousTrack)" /> </div>
        <div class="Column"><button class="btn" value="<%=audio.related%>" onclick="playNext(this.value)"/>Next >></button></div>
    </center>`
  );
  return html;
}
/**************** ************ ***********/
