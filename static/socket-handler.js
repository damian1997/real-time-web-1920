function getSocket() {
  let socket = io()
  let name = ''

  let split_path = window.location.pathname.split('/')
  let filtered_path = split_path.filter(path => {
    return (path != '')
  }) 
 
  switch(filtered_path[0]) {
    case 'party-room':
      const user = JSON.parse(getCookie('user').substr(2))
      socket.emit('new-user', user, filtered_path[1])

      socket.on('user-joined', user => {
        const user_list_container = document.querySelector('.users--list')
        const list_node = document.querySelector(`[data-spotifyid*="${user.spotify_id}"]`)

        user_list_container.insertAdjacentHTML('beforeend', `<li data-spotifyid="${user.spotify_id}">${user.display_name}</li>`)
      })

      socket.on('user-left', user => {
        console.log('user left')
        const list_node = document.querySelector(`[data-spotifyid*="${user.spotify_id}"]`)
        if(list_node) {
          list_node.remove()
        }
      })

      socket.on('track-added-succes', track => {
        const track_added_overlay = `<li class="track--added-overlay" data-trackid="${track.id}">The track ${track.name} has been added to the playback que</div>`
        document.querySelector('.que--just-added').insertAdjacentHTML('beforeend',track_added_overlay)
      })
      break;
    default: 
      socket = io('/')
      break;
  }

  return socket
}

getSocket()

function getCookie(cname) {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
