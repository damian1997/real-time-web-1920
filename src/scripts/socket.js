let socket = io()
switch(window.location.pathname) {
  case '/tech':
    socket = io('/tech')
    socket.on('chat message', (message) => {
      console.log(message)
      const li = document.createElement('li')  
      li.innerHTML = message
      document.getElementById('messages').appendChild(li)
    })
    formHandler(socket)
    break;
  default:
    socket = io('/general')
    socket.on('chat message', (message) => {
      console.log(message)
      const li = document.createElement('li')  
      li.innerHTML = message
      document.getElementById('messages').appendChild(li)
    })
    formHandler(socket)

    break;
}

function formHandler(socket) {
  document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault()
    socket.emit('chat message', document.getElementById('msg').value)
  })
}
