import { activeTempo, updateTempoUI } from "./tempo.js";
import {
  updateActiveKey,
} from "./dom.js";
import "./shuffle.js";
import { file } from "./utils.js";
import {getSongs} from "./getSongs.js";
import {quantumRandom} from "./cryptoRandom.js";

export const magicNumber = 5;

export let trackIndex = 0;
export let isMagicTime = trackIndex % magicNumber === 0;

let lastValues = []

export const getSelectedSongIds = (part2) => {
  window.playedAcapellas = window.playedAcapellas || [];
  window.playedInstrumentals = window.playedInstrumentals || [];
  const songs = getSongs()
  const artistsArray = window.playedAcapellas
      .map(x=>x.artist)
  let filteredSongs = songs
      .thisKeySongs
      .filter(x=>!artistsArray.includes(x.artist))
      .filter(x=>x.instrumentalOnly !== true)
      .filter(v=>!window.playedAcapellas.flat().includes(v.id))
      ._shuffle()._shuffle()._shuffle()
  if (filteredSongs.length === 0) {
    filteredSongs = songs
        .thisTempoSongs
        .filter(v=>!window.playedAcapellas.flat().includes(v.id))
        ._shuffle()._shuffle()._shuffle()
  }
  const acapellaSong = filteredSongs[Math.floor(quantumRandom() * filteredSongs.length)]
  const acapella = acapellaSong.id
  window.playedAcapellas.push(acapella)

  let filteredValues = songs
      .thisKeySongs
      .filter(x=>x.id !== acapella)
      .filter(x=>x.acapellaOnly !== true)
      .filter(x=>x.artist !== acapellaSong.artist)
      .filter(x=>!window.playedInstrumentals.includes(x.id))
      ._shuffle()._shuffle()._shuffle()

  if (filteredValues.length === 0) {
    filteredValues = songs
        .thisTempoSongs
        .filter(x=>x.id !== acapella)
        .filter(x=>x.acapellaOnly !== true)
        .filter(x=>x.artist !== acapellaSong.artist)
        .filter(x=>!window.playedInstrumentals.includes(x.id))
        ._shuffle()._shuffle()._shuffle()
  }

  let secondSong = filteredValues[Math.floor(quantumRandom() * filteredValues.length)]

  let filteredInstrumentals = songs
      .thisKeySongs
      .filter(x=>x.id !== acapella)
      .filter(x=>!window.playedInstrumentals.includes(x.id))
      .filter(x=>x.acapellaOnly !== true)
      .filter(x=>x.artist !== acapellaSong.artist)
      .filter(x=>x.artist !== secondSong.artist)
      ._shuffle()._shuffle()._shuffle()

  if (filteredInstrumentals.length === 0) {
    filteredInstrumentals = songs
        .thisTempoSongs
        .filter(x => x.id !== acapella)
        .filter(x=>!window.playedInstrumentals.includes(x.id))
        .filter(x => x.acapellaOnly !== true)
        .filter(x => x.artist !== acapellaSong.artist)
        .filter(x=>x.artist !== secondSong.artist)
        ._shuffle()._shuffle()._shuffle()
  }

  let thirdSong = filteredInstrumentals[Math.floor(quantumRandom() * filteredInstrumentals.length)]
  window.playedInstrumentals.push(secondSong.id)
  window.playedInstrumentals.push(thirdSong.id)
  console.log('🌸', songs.thisKeySongs, songs.thisTempoSongs)
  console.log('💎', filteredSongs, filteredValues, filteredInstrumentals)
  console.log('🎤', acapellaSong, secondSong, thirdSong)
  lastValues = lastValues.length === 0 ? [secondSong.id, thirdSong.id, acapella] : part2 ? lastValues : [secondSong.id, thirdSong.id, acapella];
  return lastValues;
}
export const getTracks = (
  track1,
  track2,
  track3,
) => {
  isMagicTime = trackIndex % magicNumber === 0;
  const firstTrack = file(track1, isMagicTime);
  const secondTrack = file(track2, isMagicTime);
  const thirdTrack = file(track3, isMagicTime, true);

  const returnArray = [firstTrack, secondTrack, thirdTrack]

  if (isMagicTime) {
  } else {
    updateTempoUI(firstTrack.bpm);
    updateActiveKey();
  }
  trackIndex += 1;
  return {
    bpm: activeTempo,
    list: returnArray,
  };
};
