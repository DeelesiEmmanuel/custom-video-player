"use strict";

// selecting elements
const videoPlayer = document.querySelector("#video_player");
const VideoScr = videoPlayer.querySelector("#video-src");
const videoTime = videoPlayer.querySelector(".videoTime");
const videoControls = videoPlayer.querySelector(".video_controls");
const videoProgressLine = videoPlayer.querySelector(".video_progress-line");
const videoProgressBar = videoPlayer.querySelector(".video_progress-bar");
const fastRewind = videoPlayer.querySelector(".fast-rewind");
const play_n_pause = videoPlayer.querySelector(".play_pause");
const fastForward = videoPlayer.querySelector(".fast-forward");
const volume = videoPlayer.querySelector(".volume");
const volumeRange = videoPlayer.querySelector(".volume_range");
const current = videoPlayer.querySelector(".current");
const totalVideoDuration = videoPlayer.querySelector(".video_duration");
const autoPlay = videoPlayer.querySelector(".video_auto-play");
const pictureInpicture = videoPlayer.querySelector(".picture_in_picture_mode");
const fullscreenMode = videoPlayer.querySelector(".fullscreen_mode");
const loadingIndicator = videoPlayer.querySelector(".loading_indicator");

// Displaying controls on mouse-enter
videoPlayer.addEventListener("mouseenter", () => {
  videoControls.classList.add("active");
});

//Display loading spinner when video is loading
VideoScr.addEventListener("waiting", () => {
  loadingIndicator.style.display = "block";
});

VideoScr.addEventListener("canplay", () => {
  loadingIndicator.style.display = "none";
});


// Play Video function
const playVideo = () => {
  play_n_pause.innerHTML = "pause";
  play_n_pause.title = "pause";
  videoPlayer.classList.add("paused");
  VideoScr.play();
};

VideoScr.addEventListener("play", () => {
  playVideo();
});

// Pause Video function
const pauseVideo = () => {
  play_n_pause.innerHTML = "play_arrow";
  play_n_pause.title = "play";
  videoPlayer.classList.remove("paused");
  VideoScr.pause();
};

VideoScr.addEventListener("pause", () => {
  pauseVideo();
});

// toggle play/pause
play_n_pause.addEventListener("click", () => {
  const isVideoPaused = videoPlayer.classList.contains("paused");
  if (isVideoPaused) {
    pauseVideo();
  } else {
    playVideo();
  }
});


// Rewind video function
fastRewind.addEventListener("click", () => {
  VideoScr.currentTime -= 10;
});

// Fast-Forward video function
fastForward.addEventListener("click", () => {
  VideoScr.currentTime += 10;
});


// volume controls
const setVolume = () => {
  VideoScr.volume = volumeRange.value / 100;
  if (volumeRange.value == 0) {
    volume.innerHTML = "volume_off";
  } else if (volumeRange.value < 39) {
    volume.innerHTML = "volume_down";
  } else {
    volume.innerHTML = "volume_up";
  }
};

volumeRange.addEventListener("change", () => {
  setVolume();
});

// mute volume
const muteVideoVolume = () => {
  if (volumeRange.value == 0) {
    volumeRange.value = 60;
    VideoScr.volume = 0.6;
    volume.innerHTML = "volume_up";
  } else {
    volumeRange.value = 0;
    VideoScr.volume = 0;
    volume.innerHTML = "volume_off";
  }
};

volume.addEventListener("click", () => {
  muteVideoVolume();
});

// Loading Video Duration Function
VideoScr.addEventListener("loadeddata", (e) => {
  let videoDuration = e.target.duration;
  let totalMin = Math.floor(videoDuration / 60);
  let totalSec = Math.floor(videoDuration % 60);

  // if video seconds are less then 10, then add 0 at the begning
  totalSec < 10 ? (totalSec = "0" + totalSec) : totalSec;
  totalVideoDuration.innerHTML = `${totalMin} : ${totalSec}`;
});

// Current Video Duration
VideoScr.addEventListener("timeupdate", (e) => {
  let currentVideoTime = e.target.currentTime;
  let currentVideoMinute = Math.floor(currentVideoTime / 60);
  let currentVideoSeconds = Math.floor(currentVideoTime % 60);
  // if seconds are less then 10 then add 0 at the begning
  currentVideoSeconds < 10
    ? (currentVideoSeconds = "0" + currentVideoSeconds)
    : currentVideoSeconds;
  current.innerHTML = `${currentVideoMinute} : ${currentVideoSeconds}`;

  let videoDuration = e.target.duration;
  // progressBar width change
  let progressWidth = (currentVideoTime / videoDuration) * 100 + 0.5;
  videoProgressBar.style.width = `${progressWidth}%`;
});


// Seeking on progressline
videoProgressLine.addEventListener("pointerdown", (e) => {
  videoProgressLine.setPointerCapture(e.pointerId);
  setVideoTime(e);
  videoProgressLine.addEventListener("pointermove", setVideoTime);
  videoProgressLine.addEventListener("pointerup", () => {
    videoProgressLine.removeEventListener("pointermove", setVideoTime);
  });
});

const setVideoTime = (e) => {
  let videoDuration = VideoScr.duration;
  let progressWidthvalue = videoProgressLine.clientWidth + 2;
  let ClickOffsetX = e.offsetX;
  VideoScr.currentTime = (ClickOffsetX / progressWidthvalue) * videoDuration;

  let progressWidth = (VideoScr.currentTime / videoDuration) * 100 + 0.5;
  videoProgressBar.style.width = `${progressWidth}%`;

  let currentVideoTime = VideoScr.currentTime;
  let currentVideoMinute = Math.floor(currentVideoTime / 60);
  let currentVideoSeconds = Math.floor(currentVideoTime % 60);
  // if seconds are less then 10 then add 0 at the begning
  currentVideoSeconds < 10
    ? (currentVideoSeconds = "0" + currentVideoSeconds)
    : currentVideoSeconds;
  current.innerHTML = `${currentVideoMinute} : ${currentVideoSeconds}`;
};




// Displaying tooltip on progressline
videoProgressLine.addEventListener("mousemove", (e) => {
  let progressWidthvalue = videoProgressLine.clientWidth + 2;
  let x = e.offsetX;
  let videoDuration = VideoScr.duration;
  let progressTime = Math.floor((x / progressWidthvalue) * videoDuration);
  let currentVideoMinute = Math.floor(progressTime / 60);
  let currentVideoSeconds = Math.floor(progressTime % 60);
  videoTime.style.setProperty("--x", `${x}px`);
  videoTime.style.display = "block";
  if (x >= progressWidthvalue - 80) {
    x = progressWidthvalue - 80;
  } else if (x <= 75) {
    x = 75;
  } else {
    x = e.offsetX;
  }

  // if seconds are less then 10 then add 0 at the beginning
  currentVideoSeconds < 10
    ? (currentVideoSeconds = "0" + currentVideoSeconds)
    : currentVideoSeconds;
  videoTime.innerHTML = `${currentVideoMinute} : ${currentVideoSeconds}`;
});

videoProgressLine.addEventListener("mouseleave", () => {
  videoTime.style.display = "none";
});

// Auto replay
autoPlay.addEventListener("click", () => {
  autoPlay.classList.toggle("active");
  if (autoPlay.classList.contains("active")) {
    autoPlay.title = "Autoplay is on";
  } else {
    autoPlay.title = "Autoplay is off";
  }
});

VideoScr.addEventListener("ended", () => {
  if (autoPlay.classList.contains("active")) {
    playVideo();
  } else {
    play_pause.innerHTML = "replay";
    play_pause.title = "Replay";
  }
});

// Picture in picture mode
pictureInpicture.addEventListener("click", () => {
  VideoScr.requestPictureInPicture();
});

// Full screen function
fullscreenMode.addEventListener("click", () => {
  if (!videoPlayer.classList.contains("openFullScreen")) {
    videoPlayer.classList.add("openFullScreen");
    fullscreenMode.innerHTML = "fullscreen_exit";
    videoPlayer.requestFullscreen();
  } else {
    videoPlayer.classList.remove("openFullScreen");
    fullscreenMode.innerHTML = "fullscreen";
    document.exitFullscreen();
  }
});

