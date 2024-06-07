const tracks = []

export const addTracks = (newTracks) => {
    if (typeof tracks === 'number' || Array.isArray(tracks)) {
        tracks.push(newTracks)
    }
}
