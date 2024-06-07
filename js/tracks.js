import {activeKey, keySort} from "./key.js";
import { getSongById } from "./song.js";
import { activeTempo, updateTempoUI } from "./tempo.js";
import { songdata } from "./songdata.js";
import { addTracks } from "./share.js";
import {
  firstSongLabel,
  fourthSongLabel,
  hideElement,
  secondSongLabel,
  showElement,
  thirdSongLabel,
  updateActiveKey,
} from "./dom.js";
import "./shuffle.js";
import { file } from "./utils.js";
import {getSongs} from "./getSongs.js";

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
    window.playedSongs.push([thirdSongId]);
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
    // loadSongsIntoSelect();
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
  window.playedSongs = window.playedSongs || [];
  const songs = getSongs()
  const acapella = songs.thisTempoSongs.filter(v=>!window.playedSongs.flat().includes(v.id)).sort(keySort).slice(0, 6)._shuffle()[0].id
  let values = songs.thisTempoSongs.sort(keySort).slice(0, 6)._shuffle();
  let firstTwo = values.slice(0, 2).map(x=>x.id)
  lastValues = lastValues.length === 0 ? [...firstTwo, acapella] : part2 ? lastValues : [...firstTwo, acapella];
  return lastValues;
}

export const getSelectedSongIds = () => {
   return [];
};
export const getTracks = (
  track1,
  track2,
  track3,
  skipSamples = false,
  isFromCountdown = false,
) => {
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
  addTracks([firstSongId, secondSongId, thirdSongId]);
  const returnArray = [firstTrack, secondTrack, thirdTrack]
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
