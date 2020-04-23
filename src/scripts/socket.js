export function getSocket() {
  let socket = io()
  let name = ''

  switch(window.location.pathname) {
    case '/hardcore_room':
      socket = io('/hardcore_room')
      break;
    default: 
      socket = io('/')
      break;
  }

  return socket
}
