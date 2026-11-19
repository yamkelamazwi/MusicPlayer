const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const playingSong = document.getElementById("player-song-title");
const songArtist = document.getElementById("player-song-artist");

const allSongs = [
  {
    id: 0,
    title: "Hello World",
    artist: "Rafael",
    duration: "0:23",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/hello-world.mp3",
  },
  {
    id: 1,
    title: "In the Zone",
    artist: "Rafael",
    duration: "0:11",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/in-the-zone.mp3",
  },
  {
    id: 2,
    title: "Camper Cat",
    artist: "Rafael",
    duration: "0:21",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/camper-cat.mp3",
  },
  {
    id: 3,
    title: "Electronic",
    artist: "Rafael",
    duration: "0:15",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/electronic.mp3",
  },
  {
    id: 4,
    title: "Sailing Away",
    artist: "Rafael",
    duration: "0:22",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/sailing-away.mp3",
  },
];

const audio = new Audio();

const userData = {
  songs: allSongs,
  currentSong: null,
  songCurrentTime: 0,
};

const setPlayPauseIcon = (isPlaying) => {
  const playIcon = playButton.querySelector(".play-icon");
  const pauseIcon = playButton.querySelector(".pause-icon");

  playIcon.hidden = isPlaying;
  pauseIcon.hidden = !isPlaying;
  playButton.classList.toggle("is-playing", isPlaying);

  const songTitle = userData.currentSong?.title;
  playButton.setAttribute(
    "aria-label",
    isPlaying
      ? `Pause ${songTitle ?? "song"}`
      : songTitle
        ? `Play ${songTitle}`
        : "Play"
  );
};

const playSong = (id, start = true) => {
  const song = userData.songs.find((song) => song.id === id);
  if (!song) return;

  audio.src = song.src;
  audio.title = song.title;

  if (userData.currentSong === null || start) {
    audio.currentTime = 0;
  } else {
    audio.currentTime = userData.songCurrentTime;
  }

  userData.currentSong = song;
  setPlayPauseIcon(true);

  highlightCurrentSong();
  setPlayerDisplay();
  audio.play().catch(() => {
    setPlayPauseIcon(false);
  });
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
  if (previousSong) {
    playSong(previousSong.id);
  } else {
    playSong(userData.songs[0].id);
  }
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
    setPlayPauseIcon(false);
    audio.pause();
  }
};

const setPlayerDisplay = () => {
  const currentTitle = userData.currentSong?.title;
  const currentArtist = userData.currentSong?.artist;

  playingSong.textContent = currentTitle || "";
  songArtist.textContent = currentArtist || "";
};

const highlightCurrentSong = () => {
  const previousCurrentSong = document.querySelector('.playlist-song[aria-current="true"]');
  previousCurrentSong?.removeAttribute("aria-current");

  const songToHighlight = document.getElementById(
    `song-${userData.currentSong?.id}`
  );

  songToHighlight?.setAttribute("aria-current", "true");
};

playButton.addEventListener("click", () => {
  if (userData.currentSong === null) {
    playSong(userData.songs[0].id);
  } else if (!audio.paused) {
    pauseSong();
  } else {
    playSong(userData.currentSong.id, false);
  }
});

document.querySelectorAll(".playlist-song").forEach((song) => {
  const id = Number(song.id.slice(5));
  song.querySelector("button").addEventListener("click", () => {
    playSong(id);
  });
});

nextButton.addEventListener("click", playNextSong);
previousButton.addEventListener("click", playPreviousSong);
audio.addEventListener("ended", playNextSong);
audio.addEventListener("play", () => setPlayPauseIcon(true));
audio.addEventListener("pause", () => setPlayPauseIcon(false));

setPlayPauseIcon(false);
