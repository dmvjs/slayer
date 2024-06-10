import {activeKey, getNextKey} from "./key.js";
import {activeTempo} from "./tempo.js";
import {resetSongs, songs} from "./song.js";

resetSongs()

export const getSongs = (key) => {
    const nextKey = getNextKey(key !== undefined ? key : activeKey);
    const previousKey = getNextKey(key !== undefined ? key : activeKey, true);
    let thisTempoSongs = songs.filter((item)=> item.bpm === activeTempo)
    let thisKeySongs =
        thisTempoSongs.filter((item)=> {
            return item.key === activeKey ||
                item.key === nextKey ||
                item.key === previousKey
        })
    return {thisKeySongs, thisTempoSongs};
}
