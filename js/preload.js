import {getTracks} from "./tracks.js";
import {BufferLoader} from "./BufferLoader.js";
import {context} from "./context.js";
import {bufferPadding, getBuffer, setBufferPadding} from "./buffers.js";

let bufferLoader;
let isFirst = true;

function init() {
    bufferLoader = new BufferLoader(
        context,
        getTracks(),
        finishedLoading
    );
    bufferLoader.load();
}

function getAndStartBuffer(bufferListItem, time, addListener) {
    const source = getBuffer()
    source.buffer = bufferListItem;
    source.connect(context.destination);
    source.start(time);
    source.stop(time + bufferListItem.duration)
    if (addListener) {
        source.addEventListener('ended', init)
    }
}

function finishedLoading(bufferList) {
    getAndStartBuffer(bufferList[0], bufferPadding, true)

    const min = bufferList[0].duration;
    setBufferPadding(bufferPadding + min);
    if (isFirst) {
        isFirst = false;
        init();
    }
}

window.onload = init;