const playButton = document.getElementById("play");
const playPauseGlyph = document.getElementById("play-pause-glyph");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const playingSong = document.getElementById("player-song-title");
const songArtist = document.getElementById("player-song-artist");

const PLAY_ICON_PATH = "M0 0L16.1852 9.5L0 19V0Z";
const PAUSE_ICON_PATH = "M0 0H4.75V19H0V0ZM11.4 0H16.15V19H11.4V0Z";

const allSongs = [
  { id: 0, title: "Hello World", artist: "Rafael", duration: "0:23", src: "https://cdn.freecodecamp.org/curriculum/js-music-player/hello-world.mp3" },
  { id: 1, title: "In the Zone", artist: "Rafael", duration: "0:11", src: "https://cdn.freecodecamp.org/curriculum/js-music-player/in-the-zone.mp3" },
  { id: 2, title: "Camper Cat", artist: "Rafael", duration: "0:21", src: "https://cdn.freecodecamp.org/curriculum/js-music-player/camper-cat.mp3" },
  { id: 3, title: "Electronic", artist: "Rafael", duration: "0:15", src: "https://cdn.freecodecamp.org/curriculum/js-music-player/electronic.mp3" },
  { id: 4, title: "Sailing Away", artist: "Rafael", duration: "0:22", src: "https://cdn.freecodecamp.org/curriculum/js-music-player/sailing-away.mp3" },
];

const audio = new Audio();
const userData = {
  songs: allSongs,
  currentSong: null,
  songCurrentTime: 0,
};

const setPlayPauseIcon = (isPlaying) => {
  playPauseGlyph.setAttribute("d", isPlaying ? PAUSE_ICON_PATH : PLAY_ICON_PATH);
  playButton.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
  playButton.setAttribute("aria-pressed", String(isPlaying));
};

const playSong = async (id, start = true) => {
  const song = userData.songs.find((item) => item.id === id);
  if (!song) return;

  audio.src = song.src;
  audio.title = song.title;
  audio.currentTime = userData.currentSong === null || start
    ? 0
    : userData.songCurrentTime;

  userData.currentSong = song;
  highlightCurrentSong();
  setPlayerDisplay();

  try {
    await audio.play();
    setPlayPauseIcon(true);
  } catch (error) {
    setPlayPauseIcon(false);
    console.error("Unable to play this track:", error);
  }
};

const pauseSong = () => {
  userData.songCurrentTime = audio.currentTime;
  audio.pause();
  setPlayPauseIcon(false);
};

const getCurrentSongIndex = () => userData.songs.indexOf(userData.currentSong);
const getNextSong = () => userData.songs[getCurrentSongIndex() + 1];
const getPreviousSong = () => userData.songs[getCurrentSongIndex() - 1];

const playPreviousSong = () => {
  if (userData.currentSong === null) return;
  const previousSong = getPreviousSong();
  playSong(previousSong ? previousSong.id : userData.songs[0].id);
};

const playNextSong = () => {
  if (userData.currentSong === null) {
    playSong(userData.songs[0].id);
    return;
  }

  const nextSong = getNextSong();
  if (nextSong) {
    playSong(nextSong.id);
  } else {
    userData.currentSong = null;
    userData.songCurrentTime = 0;
    setPlayerDisplay();
    highlightCurrentSong();
    audio.pause();
    setPlayPauseIcon(false);
  }
};

const setPlayerDisplay = () => {
  playingSong.textContent = userData.currentSong?.title || "";
  songArtist.textContent = userData.currentSong?.artist || "";
};

const highlightCurrentSong = () => {
  document.querySelector('.playlist-song[aria-current="true"]')
    ?.removeAttribute("aria-current");
  document.getElementById(`song-${userData.currentSong?.id}`)
    ?.setAttribute("aria-current", "true");
};

playButton.addEventListener("click", () => {
  if (userData.currentSong === null) {
    playSong(userData.songs[0].id);
  } else if (audio.paused) {
    playSong(userData.currentSong.id, false);
  } else {
    pauseSong();
  }
});

document.querySelectorAll(".playlist-song").forEach((song) => {
  song.querySelector("button").addEventListener("click", () => {
    playSong(Number(song.id.slice(5)));
  });
});

nextButton.addEventListener("click", playNextSong);
previousButton.addEventListener("click", playPreviousSong);
audio.addEventListener("play", () => setPlayPauseIcon(true));
audio.addEventListener("pause", () => setPlayPauseIcon(false));
audio.addEventListener("ended", playNextSong);
setPlayPauseIcon(false);
