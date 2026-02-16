let player;
let isPlaying = false;

const PLAYLIST_ID = "YOUR_PLAYLIST_ID_HERE";

const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const title = document.getElementById("track-title");
const uploader = document.getElementById("track-uploader");
const thumb = document.getElementById("thumbnail");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "0",
    width: "0",
    playerVars: {
      listType: "playlist",
      list: PLAYLIST_ID,
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      modestbranding: 1,
      rel: 0,
      fs: 0,
      iv_load_policy: 3,
      origin: window.location.origin,
      widget_referrer: window.location.href
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerReady() {
  setInterval(updateProgress, 500);
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    isPlaying = true;
    playBtn.textContent = "⏸";
    updateMeta();
  } else if (event.data === YT.PlayerState.ENDED) {
    player.nextVideo();
  } else {
    isPlaying = false;
    playBtn.textContent = "▶";
  }
}

function updateMeta() {
  const data = player.getVideoData();
  title.textContent = data.title || "Unknown";
  uploader.textContent = data.author || "";
  thumb.src = `https://img.youtube.com/vi/${data.video_id}/hqdefault.jpg`;
}

function updateProgress() {
  if (!player || !player.getCurrentTime) return;

  const current = player.getCurrentTime();
  const total = player.getDuration();

  progress.value = (current / total) * 100 || 0;

  currentTimeEl.textContent = formatTime(current);
  durationEl.textContent = formatTime(total);
}

function formatTime(sec) {
  if (!sec) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

playBtn.addEventListener("click", () => {
  if (!isPlaying) {
    player.playVideo();
  } else {
    player.pauseVideo();
  }
});

nextBtn.addEventListener("click", () => {
  player.nextVideo();
});

prevBtn.addEventListener("click", () => {
  player.previousVideo();
});

progress.addEventListener("input", () => {
  const duration = player.getDuration();
  const seekTime = (progress.value / 100) * duration;
  player.seekTo(seekTime, true);
});

volume.addEventListener("input", () => {
  player.setVolume(volume.value);
});
