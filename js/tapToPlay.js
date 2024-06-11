import { context } from "./context.js";
import { init } from "./preload.js";
import { disableTempoButtons } from "./dom.js";
import {trackIndex} from "./tracks.js";

const playButton = document.getElementById("play-button");

const myEvent =
  "ontouchstart" in document.documentElement ? "touchend" : "click";
playButton.addEventListener(myEvent, startApplication);
export let userHasPressedPlay = false;
// Create a reference for the Wake Lock.
let wakeLock = null;

function startApplication() {
  if (userHasPressedPlay === false) {
    userHasPressedPlay = true;
    init();
  }
  playButton.removeEventListener(myEvent, startApplication);
  playButton.innerText = "⏸️ PAUSE";
  playButton.addEventListener(myEvent, pauseApplication);
  disableTempoButtons();
  wakeLock = navigator.wakeLock.request("screen");
  if (trackIndex > 0) {
    context.resume();
  }
}

function pauseApplication() {
  playButton.removeEventListener(myEvent, pauseApplication);
  playButton.innerText = "▶️ PLAY";
  context.suspend();
  playButton.addEventListener(myEvent, startApplication);
}

document.addEventListener("visibilitychange", (event) => {
  if (document.visibilityState === "visible") {
    // console.log("tab is active")
  } else {
    pauseApplication();
  }
});
