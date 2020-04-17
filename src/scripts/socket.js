let socket = io()
let name = ''

switch(window.location.pathname) {
  default: 
    socket = io('/')
    break;
}
