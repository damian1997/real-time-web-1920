export function cleanPlaylistData(data) {
  const tracks = data.tracks.items.map(item => {
    const track = {
      name: item.track.name,
      artists: (item.track.artists) ? item.track.artists : [''],
      track_url: item.track.preview_url,
      is_local: item.track.is_local
    }
    return track
  })

  return { name: data.name, tracks: tracks }
}
