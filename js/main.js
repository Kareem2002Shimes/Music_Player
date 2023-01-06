const container = document.querySelector(".container"),
  musicImg = container.querySelector(".img-area img"),
  musicName = container.querySelector(".song-details .name"),
  musicArtist = container.querySelector(".song-details .artist"),
  playPauseBtn = container.querySelector(".play-pause"),
  prevBtn = container.querySelector("#prev"),
  nextBtn = container.querySelector("#next"),
  mainAudio = container.querySelector("#main-audio"),
  progressArea = container.querySelector(".progress-area"),
  progressBar = progressArea.querySelector(".progress-bar");

let musicIndex = 0;
let isPlaying = false;

window.addEventListener("load", () => {
  loadMusic(musicIndex);
});
function loadMusic(indexNumb) {
  musicName.innerHTML = allMusic[indexNumb].name;
  musicArtist.innerText = allMusic[indexNumb].artist;
  musicImg.src = allMusic[indexNumb].img;
  mainAudio.src = allMusic[indexNumb].src;
}
function playMusic() {
  isPlaying = true;
  playPauseBtn.querySelector("i").innerHTML = "pause";

  mainAudio.play();
}
function pauseMusic() {
  isPlaying = false;
  playPauseBtn.querySelector("i").innerHTML = "play_arrow";

  mainAudio.pause();
}
playPauseBtn.addEventListener("click", () => {
  isPlaying ? pauseMusic() : playMusic();
});

function nextMusic() {
  musicIndex++;
  musicIndex > allMusic.length - 1
    ? (musicIndex = 0)
    : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
}

nextBtn.addEventListener("click", () => {
  nextMusic();
});
function prevMusic() {
  musicIndex--;
  musicIndex < 0
    ? (musicIndex = allMusic.length - 1)
    : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
}
prevBtn.addEventListener("click", () => {
  prevMusic();
});
const repeatBtn = container.querySelector("#repeat-plist");

repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerHTML;
  switch (getText) {
    case "repeat":
      repeatBtn.innerHTML = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerHTML = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerHTML = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});
mainAudio.addEventListener("ended", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      nextMusic();
      break;
    case "repeat_one":
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    case "shuffle":
      let randIndex = Math.floor(Math.random() * allMusic.length);
      do {
        randIndex = Math.floor(Math.random() * allMusic.length);
      } while (musicIndex == randIndex);
      {
        musicIndex = randIndex;
        loadMusic(musicIndex);
        playMusic();
        break;
      }
  }
});
mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;
  let musicCurrentTime = container.querySelector(".current-time"),
    musicDuration = container.querySelector(".max-duration");

  mainAudio.addEventListener("loadeddata", () => {
    const interval = setInterval(() => {
      const _elapsed = mainAudio.currentTime;
      musicCurrentTime.innerHTML = formatTime(_elapsed);
    }, 1000);
    const _duration = mainAudio.duration;
    musicDuration.innerHTML = formatTime(_duration);
    mainAudio.addEventListener("ended", () => {
      clearInterval(interval);
    });
  });
});
progressArea.addEventListener("click", (e) => {
  let progressWidth = progressArea.clientWidth;
  let clickedOffsetX = e.offsetX;
  let songDuration = mainAudio.duration;

  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic();
});

function formatTime(time) {
  if (time && !isNaN(time)) {
    const minutes =
      Math.floor(time / 60) < 10
        ? `0${Math.floor(time / 60)}`
        : Math.floor(time / 60);
    const seconds =
      Math.floor(time % 60) < 10
        ? `0${Math.floor(time % 60)}`
        : Math.floor(time % 60);
    return `${minutes}:${seconds}`;
  }
  return "00:00";
}
