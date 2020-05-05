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
      console.log(user)
      socket.emit('new-user', user.display_name, filtered_path[1])
      socket.on('user-joined', user => {
        console.log(`User named ${user} joined the room`)
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
