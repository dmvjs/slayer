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
import { file, hasError } from "./utils.js";

let bufferLoader;
let isFirst = true;

let tempoChangeIndex = 0;

export const resetTempoIndex = () => {
  tempoChangeIndex = 0;
};

export const init = () => {
  if (isFirst || isMagicTime) {
    loadTracks();
  } else {
    loadTracks(true);
  }
};

const loadTracks = () => {
  const ids = getSelectedSongIds(trackIndex % magicNumber === 1);
  if (ids) {
    const p1 = fetch(file(ids[0], trackIndex % magicNumber === 0));
    const p2 = fetch(file(ids[1], trackIndex % magicNumber === 0));
    const p3 = fetch(file(ids[2], trackIndex % magicNumber === 0, true));
    Promise.all([p1, p2, p3]).then(() => {
      if (isFirst) {
        context.resume()
      }
      bufferLoader = new BufferLoader(
        context,
        getTracks(...ids),
        finishedLoading,
      );
      bufferLoader.load();
    }, hasError);
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
  ]);
  if (bufferList[1]) {
    getAndStartBuffer(bufferList[1], bufferPadding);
  }
  if (bufferList[2]) {
    getAndStartBuffer(bufferList[2], bufferPadding);
  }

  const barDuration = 60 / tempo;
  const min =
    bufferList[0].duration < 32
        ? barDuration * 64
      : barDuration * 256;
  setBufferPadding(bufferPadding + min);
  replenishBuffers(bufferList.length);
  if (isFirst) {
    isFirst = false;
    init();
  }
}
