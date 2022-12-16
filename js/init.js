import {songdata} from "./songdata.js";

if (!location.host.includes('localhost') && location.protocol !== 'https:') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
}

export const showSongMatrix = (array) => {
    const rv = (Array.from({length: 12}, (int, index)=> {
        return array.filter((item)=> {
            return item.bpm === 123 && item.key === index + 1
        })
    }))
    console.log(123, rv.flat().length, rv)
}

showSongMatrix(songdata)
