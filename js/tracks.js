import { activeKey, keySort } from "./key.js";
import { filetype } from "./filetype.js";
import { justStarTrekIntro, samples } from "./samples.js";
import { getSongById } from "./song.js";
import { activeTempo, updateTempoUI } from "./tempo.js";
import { quantumRandom } from "./cryptoRandom.js";
import { songdata } from "./songdata.js";
import { addTracks } from "./share.js";
import {
  deck1Select,
  deck2Select, deck3Select,
  firstSongLabel,
  fourthSongLabel,
  hideElement,
  secondSongLabel,
  showElement,
  thirdSongLabel,
  updateActiveKey,
} from "./dom.js";
import { getSong, getSongs } from "./getSongs.js";
import "./shuffle.js";
import { file } from "./utils.js";

let holder = {};
export const magicNumber = 5;

export let trackIndex = 0;
export let isMagicTime = trackIndex % magicNumber === 0;

export let fsID;
export let ssID;

export const updateUI = (
  key,
  firstSongId,
  secondSongId,
  thirdSongId,
  trackIndex,
  isFromCountdown = false,
) => {
  fsID = firstSongId;
  ssID = secondSongId;
  return () => {
    document.body.className = `color-${key}`;
    window.playedSongs = window.playedSongs || [];
    window.playedSongs.push([firstSongId, secondSongId]);
    const firstSongUI = songdata.filter(
      (item) =>
        item.id === window.playedSongs[trackIndex < 0 ? 0 : trackIndex][0],
    )[0];
    const secondSongUI = songdata.filter(
      (item) =>
        item.id === window.playedSongs[trackIndex < 0 ? 0 : trackIndex][1],
    )[0];
    const thirdSongUI = songdata.filter(
      (item) =>
        item.id ===
        window.playedSongs[trackIndex - 1 < 0 ? 0 : trackIndex - 1][0],
    )[0];
    const fourthSongUI = songdata.filter(
      (item) =>
        item.id ===
        window.playedSongs[trackIndex - 1 < 0 ? 0 : trackIndex - 1][1],
    )[0];
    firstSongLabel.innerText = `${thirdSongUI.artist || ""} - ${
      thirdSongUI.title || ""
    }`;
    secondSongLabel.innerText = `${fourthSongUI?.artist || ""} - ${
      fourthSongUI?.title || ""
    }`;
    thirdSongLabel.innerText = `${firstSongUI?.artist || ""} - ${
      firstSongUI.title || ""
    }`;
    fourthSongLabel.innerText = `${secondSongUI?.artist || ""} - ${
      secondSongUI?.title || ""
    }`;
    firstSongLabel.className = `text-color-${thirdSongUI?.key}`;
    secondSongLabel.className = `text-color-${fourthSongUI?.key}`;
    thirdSongLabel.className = `text-color-${firstSongUI.key}`;
    fourthSongLabel.className = `text-color-${secondSongUI?.key}`;
    loadSongsIntoSelect();
    document.getElementById("play-button").className = `button-color-${key}`;
    document.getElementById("contact-button").className = `button-color-${key}`;
    document.getElementById("youtube-button").className = `button-color-${key}`;
    document.getElementById("github-button").className = `button-color-${key}`;
    if (isFromCountdown) {
      showElement(document.getElementById("on-deck"));
    } else {
      hideElement(document.getElementById("on-deck"));
    }
    showElement(document.getElementById("now-playing"));
  };
};

let lastValues = []

export const getIdsFromArray = (part2) => {
  let values = [1,2,3,4,5,6,7,8,9]._shuffle();
  console.log('🏁', lastValues.length, part2)
  lastValues = lastValues.length === 0 ? values.slice(0, 3) : part2 ? lastValues : values.slice(0, 3);
  return lastValues;
}

export const getSelectedSongIds = (isAfterMagic) => {
  const songs = getSongs();
  const firstSong =
    deck1Select.value === "-1"
      ? null
      : songs.thisTempoSongs.find((s) => {
          return s.id === parseInt(deck1Select.value, 10);
        });
  const secondSong =
    deck2Select.value === "-1"
      ? null
      : songs.thisTempoSongs.find((s) => {
          return s.id === parseInt(deck2Select.value, 10);
        });
  const thirdSong =
      deck2Select.value === "-1"
          ? null
          : songs.thisTempoSongs.find((s) => {
            return s.id === parseInt(deck3Select.value, 10);
          });

   return getIdsFromArray(isAfterMagic);
};
export const loadSongsIntoSelect = () => {
  const songs = getSongs();
  deck1Select.length = 0;
  deck2Select.length = 0;
  deck3Select.length = 0;
  const optionDefault1 = document.createElement("option");
  optionDefault1.value = "-1";
  optionDefault1.innerText = `Pick next deck 1 song ${activeTempo}bpm`;
  deck1Select.appendChild(optionDefault1);
  deck1Select.value = "-1";

  const optionDefault2 = document.createElement("option");
  optionDefault2.value = "-1";
  optionDefault2.innerText = `Pick next deck 2 song ${activeTempo}bpm`;
  deck2Select.appendChild(optionDefault2);
  deck2Select.value = "-1";

  const optionDefault3 = document.createElement("option");
  optionDefault3.value = "-1";
  optionDefault3.innerText = `Pick next deck 3 song ${activeTempo}bpm`;
  deck3Select.appendChild(optionDefault3);
  deck3Select.value = "-1";
  [
    ...new Set(
      songs.thisTempoSongs
        .filter(Boolean)
        .sort((a, b) => a.title < b.title)
        .sort((a, b) => a.artist > b.artist)
        .sort(keySort),
    ),
  ].map((item) => {
    const option1 = document.createElement("option");
    option1.value = `${item.id}`;
    option1.innerText = `${item.artist} - ${item.title} [${item.key}]`;
    const option2 = document.createElement("option");
    option2.value = `${item.id}`;
    option2.innerText = `${item.artist} - ${item.title} [${item.key}]`;
    const option3 = document.createElement("option");
    option3.value = `${item.id}`;
    option3.innerText = `${item.artist} - ${item.title} [${item.key}]`;
    deck1Select.appendChild(option1);
    deck2Select.appendChild(option2);
    deck3Select.appendChild(option3);
  });
  //const ids = getIdsFromArray();
  /*deck1Select.value = ids[0];
  deck2Select.value = ids[1];
  deck3Select.value = ids[2];*/
};
export const getTracks = (
  track1,
  track2,
  track3,
  skipSamples = false,
  isFromCountdown = false,
) => {
  const isUsingTracksFromURL = track1 !== undefined;
  isMagicTime = trackIndex % magicNumber === 0;
  if (isMagicTime) {
    // console.log('station identification…')
  }
  const firstSongFromURL = track1 && getSongById(track1);
  const ids = getIdsFromArray( trackIndex % magicNumber === 1);
  const firstSongId = ids[0]
  const secondSongId = ids[1]
  const thirdSongId = ids[2]

  if (!isMagicTime) {
    // console.log('followed by…')
  }
  const firstTrack = file(firstSongId, isMagicTime);
  let secondTrack;
  let thirdTrack;
  if (secondSongId) {
    secondTrack = file(secondSongId, isMagicTime);
    thirdTrack = file(thirdSongId, isMagicTime, true);
  }
  addTracks([firstSongId, secondSongId]);
  const returnArray = [firstTrack];
  if (secondTrack) {
    returnArray.push(secondTrack);
    returnArray.push(thirdTrack);
  }
  console.log(returnArray)

  requestAnimationFrame(
    updateUI(activeKey, firstSongId, secondSongId, thirdSongId, trackIndex, isFromCountdown),
  );
  if (isMagicTime) {
    holder[trackIndex] = [firstSongId, secondSongId, thirdSongId];
  } else {
    updateTempoUI(firstSongId.bpm);
    updateActiveKey();
  }
  trackIndex += 1;
  return {
    bpm: firstSongFromURL?.bpm || activeTempo,
    list: returnArray,
  };
};
