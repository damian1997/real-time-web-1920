import { getSocket }from './socket'
(function () {
  const tracks = document.querySelectorAll('.playlist--tracks--track')
  const socket = getSocket()

  if(tracks) {
    tracks.forEach(track => {
      track.addEventListener('click', event => {
        const track_meta = event.target.closest('.playlist--tracks--track').dataset.meta
        const track_meta_json = JSON.parse(track_meta)

        socket.emit('add_track_to_que', track_meta_json)
      })
    })
  }
})();
