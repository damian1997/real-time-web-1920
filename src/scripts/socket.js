let socket = io()
let name = ''

switch(window.location.pathname) {
  case '/tech':
    socket = io('/tech')
    name = prompt('What is your name?')
    if(name) {
      appendMessage('You have successfully joined the server')
      socket.emit('new-user', name)

      socket.on('chat-message', (data) => {
        console.log(data)
        appendMessage(`${data.name}: ${data.message}`, data.actor)
      })

      socket.on('user-connected', name => {
        appendMessage(`${name} connected to the server`)
      })

      socket.on('command-output', output => {
        appendMessage(output)
      })


      socket.on('redirect', url => {
        window.location.href = url
      })


      formHandler(socket)
    } else {
      name = prompt('You need to fill in a name to be able to join this server')
    }
    break;
  case '/general':
    socket = io('/general')
    name = prompt('What is your name?')
    if(name) {
      appendMessage('You have successfully joined the server')
      socket.emit('new-user', name)

      socket.on('chat-message', (data) => {
        console.log(data)
        appendMessage(`${data.name}: ${data.message}`, data.actor)
      })

      socket.on('user-connected', name => {
        appendMessage(`${name} connected to the server`)
      })

      socket.on('command-output', output => {
        appendMessage(output)
      })

      socket.on('redirect', url => {
        window.location.href = url
      })


      formHandler(socket)
    } else {
      name = prompt('You need to fill in a name to be able to join this server')
    }
    break;
  default: 
    socket = io('/')
    socket.on('welcome-message', message => {
      appendMessage(message)
    })

    socket.on('command-output', output => {
      appendMessage(output)
    })

    socket.on('redirect', url => {
      window.location.href = url
    })
    
    formHandler(socket)
    break;
}

function formHandler(socket) {
  document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault()
    const MESSAGEINPUT = document.getElementById('msg')
    if(MESSAGEINPUT.value.charAt(0) === '!') {
      socket.emit('command-ran', MESSAGEINPUT.value)
    } else {
      socket.emit('chat-message', MESSAGEINPUT.value)
    }
    MESSAGEINPUT.value = ''
  })
}

function  appendMessage(message, actor = 'server') {
  let li = document.createElement('li')  
  li.classList.add(actor)
  li.innerHTML = message
  document.getElementById('messages').appendChild(li)
}
