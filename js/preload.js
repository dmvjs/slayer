import {
  getSelectedSongIds,
  getTracks,
  isMagicTime,
  magicNumber,
  trackIndex,
} from "./tracks.js";
import { BufferLoader } from "./BufferLoader.js";
import { context } from "./context.js";
import {
  bufferPadding,
  getBuffer,
  replenishBuffers,
  setBufferPadding,
} from "./buffers.js";
import { activeTempo } from "./tempo.js";
import { resetSongs } from "./song.js";
import { activeKey, getNextKey, initialKey } from "./key.js";
import {
  hideElement,
  showElement,
} from "./dom.js";
import { file, hasError } from "./utils.js";

let bufferLoader;
let isFirst = true;

let tempoChangeIndex = 0;
let usingTracksFromURL = false;

export const resetTempoIndex = () => {
  tempoChangeIndex = 0;
};

export const init = () => {
  if (isFirst || isMagicTime) {
    loadTracks();
    hideElement(document.getElementById("up-next"));
    hideElement(document.getElementById("on-deck"));
  } else {
    hideElement(document.getElementById("hurricane-container"));
    //deck1Select.disabled = false;
    //deck2Select.disabled = false;
    /*const element = document.getElementById("counter-holder");
    const numberOfSeconds = 31;
    element.innerText = `${numberOfSeconds - 1}`;
    const interval = setInterval(() => {
      const value = parseInt(element.innerText, 10);
      element.innerText = `${value - 1}`;
      if (value - 1 < 7) {
        element.style.color = "lightyellow";
      }
      if (value - 1 < 3) {
        element.style.color = "pink";
      }
      if (value - 1 >= 7) {
        element.style.color = "white";
      }
    }, 1000);*/
    /*element.style.display = "inline-block";
    firstSongLabel.innerText = thirdSongLabel.innerText;
    secondSongLabel.innerText = fourthSongLabel.innerText;
    hideElement(document.getElementById("on-deck"));
    enableTempoButtons();
    setTimeout(() => {
      disableTempoButtons();
      loadTracks(true);
      hideElement(element);
      hideElement(document.getElementById("up-next"));
      clearInterval(interval);
    }, numberOfSeconds * 1000);*/
    loadTracks(true);
  }
};

const loadTracks = (isFromCountdown = false, isStartingCountdown = false) => {
  const ids = getSelectedSongIds(trackIndex % magicNumber === 1);
  if (ids && typeof 1 === "number") {
    const p1 = fetch(file(ids[0], trackIndex % magicNumber === 0));
    const p2 = fetch(file(ids[1], trackIndex % magicNumber === 0));
    const p3 = fetch(file(ids[2], trackIndex % magicNumber === 0, true));
    Promise.all([p1, p2, p3]).then(() => {
      bufferLoader = new BufferLoader(
        context,
        getTracks(...ids, isFromCountdown),
        finishedLoading,
      );
      bufferLoader.load();
    }, hasError);
  } else {
    bufferLoader = new BufferLoader(
      context,
      getTracks(
        1,
        2,
        3,
        isFromCountdown,
        isStartingCountdown,
      ),
      finishedLoading,
    );
  }
};

function getAndStartBuffer(bufferListItem, time, addListener, buffers) {
  let timestamp;
  let source = getBuffer();
  source.buffer = bufferListItem;
  source.connect(context.destination);
  source.start(time);
  source.stop(time + bufferListItem.duration);
  if (addListener) {
    source.addEventListener("ended", (event) => {
      (buffers || []).forEach((buffer) => {
        buffer = null;
      });
      showElement(document.getElementById("up-next"));
      if (event?.timeStamp && event.timeStamp - timestamp < 30) {
        return;
      }
      timestamp = event.timeStamp;
      init();
    });
  }
}

function finishedLoading(bufferList, tempo) {
  getAndStartBuffer(bufferList[0], bufferPadding, true, [
    bufferList[0],
    bufferList[1],
    bufferList[2],
    bufferList[3],
  ]);
  if (bufferList[1]) {
    getAndStartBuffer(bufferList[1], bufferPadding);
  }
  if (bufferList[2]) {
    getAndStartBuffer(bufferList[2], bufferPadding);
  }
  /*if (!usingTracksFromURL && !isFirst) {
    if (bufferList[2]) {
      // delay the start until halfway through the bar
      getAndStartBuffer(
        bufferList[2],
        bufferPadding + ((60 / activeTempo) * 16) / 2,
      );
    }
    if (bufferList[3]) {
      getAndStartBuffer(bufferList[3], bufferPadding);
    }
  }*/

  const barDuration = 60 / tempo;
  const min =
    bufferList[0].duration < 32
        ? barDuration * 64
      : barDuration * 256;
  setBufferPadding(bufferPadding + min);
  if (!usingTracksFromURL) {
    if (activeKey === getNextKey(initialKey, true)) {
      tempoChangeIndex += 1;
      if (tempoChangeIndex % 9 === 0) {
        resetSongs();
        console.log("reset songs");
      }
      /*if (activeTempo === 84) {
        setActiveTempo(94);
      } else if (activeTempo === 94) {
        setActiveTempo(102);
      } else if (activeTempo === 102) {
        setActiveTempo(123);
      } else if (activeTempo === 123) {
        setActiveTempo(84);
      }*/
      console.log("tempo change", activeTempo);
    }
  }
  replenishBuffers(bufferList.length);
  if (isFirst) {
    isFirst = false;
    init();
  }
}

//window.onload = init;
