import { config } from "./config.js";
import { songdata } from "./songdata.js";
import { quantumRandom } from "./cryptoRandom.js";
import { resetTempoIndex } from "./preload.js";
import { activeKey } from "./key.js";
import { setKey } from "./dom.js";

export const tempos = [...new Set(songdata.map((s) => s.bpm))].sort(
  (a, b) => a - b,
);
const seed = parseInt(String(Math.floor(quantumRandom() * tempos.length)), 10);
const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
const bpmFromUrl = params.bpm || null;
const allUrl = params.lock || null;
export let activeTempo =
  bpmFromUrl ?? config.initialTempo ?? tempos._shuffle()[seed];

export const onTempoChange = (e) => {
  // if the user hasnt clicked play for the first time yet,load the new tempo of songs into the UI and set active tempo
  setActiveTempo(tempos[e.target.value]);
  // loadSongsIntoSelect();
};
export const tempo1Input = document.getElementById("tempo-1");

export const updateTempoUI = (tempo) => {
  if (tempo === 123) {
    tempo1Input.checked = true;
  }
};

export const setActiveTempo = (x) => {
  if (bpmFromUrl && allUrl) {
    activeTempo = bpmFromUrl;
  }
  if (x > 50 && x < 200) {
    activeTempo = x;
  }
  resetTempoIndex();
  setKey({ target: { value: activeKey } });
  updateTempoUI(x);
};
