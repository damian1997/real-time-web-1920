import express from 'express'
import compression from 'compression'
import fs from 'fs'
import * as http from 'http';
import socketIO from 'socket.io'

const PORT = process.env.PORT || 4000,
  APP = express(),
  SERVER = http.createServer(APP),
  IO = new socketIO(SERVER),
  COMPONENTPATH = `${__dirname}/src/components`,
  BUNDLE = getBundleUrls(),
  COMMANDS = [
    { command: '!commands', description: 'Gives a list of commands' },
    { command: '!rooms', description: 'This command gives a list of available rooms' },
    { command: '!hoptoroom', description: 'Running this command and giving a room name will put you in the room' }
  ],
  ROOMS = [
    { name: 'tech', path: '/tech' },
    { name: 'general', path: '/general' }
  ]

// IO NAMESPACES
const NAMESPACES = {
  default: IO.of('/'),
  general: IO.of('/general'),
  tech: IO.of('/tech')
}

APP
  .use(compression())
  .use(express.static('static'))
  .set('view engine', 'ejs')
  .set('views', 'src/components')
  .set('trust proxy', 1)


// ROUTES
import home from './routes/home.js'
import tech from './routes/tech.js'
import general from './routes/general.js'

// DEFAULT io connection
NAMESPACES.default.on('connection', (socket) => {
  socket.emit('welcome-message', 'Welcome to the chat room, if you are new to this chat room type in !commands at the bottom of the page!')
  socket.on('command-ran', (ranCommand) => {
    const command = COMMANDS.find(command => {
      if (/\s/.test(ranCommand)) {
        const split = ranCommand.split(' ')
        return command.command === split[0]
      } else {
        return command.command === ranCommand
      }
    })

    if(command !== undefined) {
      switch(command.command) {
        case '!commands':
          // Give list of commands
          const commandlist = COMMANDS.map(command => {
            return `${command.command}: ${command.description}` 
          })
          socket.emit('command-output', commandlist.join('</br>'))
          break;
        case '!rooms': 
          const roomlist = ROOMS.map(room => {
            return `${room.name}` 
          })
          socket.emit('command-output', roomlist.join('</br>'))
          break;
        case '!hoptoroom':
          const split = ranCommand.split(' ')
          const room = ROOMS.find(room => {
            return room.name === split[1]
          })
          socket.emit('redirect', room.path) 
          break;
      }
    } else {
      socket.emit('command-output', 'No such command found, type in !command to get a list of valid commands.')
    }

  })
})

// NAMESPACE io connections
NAMESPACES.general.on('connection', (socket) => {

  console.log('someone connected to tech')

  socket.on('new-user', name => {
    socket.customProps = {}
    socket.customProps.name = name
    socket.broadcast.emit('user-connected', name)
  })

  socket.on('chat-message', (message) => {
    console.log(message)
    NAMESPACES.general.emit('chat-message', { message: message, name: socket.customProps.name })
  })

  socket.on('command-ran', (ranCommand) => {
    const command = COMMANDS.find(command => {
      if (/\s/.test(ranCommand)) {
        const split = ranCommand.split(' ')
        return command.command === split[0]
      } else {
        return command.command === ranCommand
      }
    })

    if(command !== undefined) {
      switch(command.command) {
        case '!commands':
          // Give list of commands
          const commandlist = COMMANDS.map(command => {
            return `${command.command}: ${command.description}` 
          })
          socket.emit('command-output', commandlist.join('</br>'))
          break;
        case '!rooms': 
          const roomlist = ROOMS.map(room => {
            return `${room.name}` 
          })
          socket.emit('command-output', roomlist.join('</br>'))
          break;
        case '!hoptoroom':
          const split = ranCommand.split(' ')
          const room = ROOMS.find(room => {
            return room.name === split[1]
          })
          socket.emit('redirect', room.path) 
          break;
      }
    } else {
      socket.emit('command-output', 'No such command found, type in !command to get a list of valid commands.')
    }
  })
})

NAMESPACES.tech.on('connection', (socket) => {

  console.log('someone connected to tech')

  socket.on('new-user', name => {
    socket.customProps = {}
    socket.customProps.name = name
    socket.broadcast.emit('user-connected', name)
  })

  socket.on('chat-message', (message, sender = 'other') => {
    console.log(message)
    socket.broadcast.emit('chat-message', { message: message, actor: 'user', name: socket.customProps.name, sender })
  })
  
  socket.on('command-ran', (ranCommand) => {
    const command = COMMANDS.find(command => {
      if (/\s/.test(ranCommand)) {
        const split = ranCommand.split(' ')
        return command.command === split[0]
      } else {
        return command.command === ranCommand
      }
    })

    if(command !== undefined) {
      switch(command.command) {
        case '!commands':
          // Give list of commands
          const commandlist = COMMANDS.map(command => {
            return `${command.command}: ${command.description}` 
          })
          socket.emit('command-output', { message: commandlist.join('</br>'), actor: 'server' })
          break;
        case '!rooms': 
          const roomlist = ROOMS.map(room => {
            return `${room.name}` 
          })
          socket.emit('command-output', roomlist.join('</br>'))
          break;
        case '!hoptoroom':
          const split = ranCommand.split(' ')
          const room = ROOMS.find(room => {
            return room.name === split[1]
          })
          socket.emit('redirect', room.path) 
          break;
      }
    } else {
      socket.emit('command-output', 'No such command found, type in !command to get a list of valid commands.')
    }
  })

})

APP
  .get('/', (req,res) => home(req,res,COMPONENTPATH,BUNDLE))
  .get('/tech', (req,res) => tech(req,res,COMPONENTPATH,BUNDLE))
  .get('/general', (req,res) => tech(req,res,COMPONENTPATH,BUNDLE))

SERVER.listen(PORT, () => console.log(`Using port: ${PORT}`))

function getBundleUrls() {
  const BUNDLEFILENAMES = JSON.parse(fs.readFileSync(`static/bundle/manifest.json`))
  return BUNDLEFILENAMES
}
