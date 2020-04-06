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
      BUNDLE = getBundleUrls()

// IO NAMESPACES
const NAMESPACES = {
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

// NAMESPACE io connections
NAMESPACES.general.on('connection', (socket) => {
  console.log('someone connected to general')
  socket.on('chat message', (message) => {
    console.log(message)
    NAMESPACES.general.emit('chat message', message)
  })
})

NAMESPACES.tech.on('connection', (socket) => {
  console.log('someone connected to tech')
  socket.on('chat message', (message) => {
    console.log(message)
    NAMESPACES.tech.emit('chat message', message)
  })
})

APP
  .get('/', (req,res) => home(req,res,COMPONENTPATH,BUNDLE))
  .get('/tech', (req,res) => tech(req,res,COMPONENTPATH,BUNDLE))
  
SERVER.listen(PORT, () => console.log(`Using port: ${PORT}`))

function getBundleUrls() {
  const BUNDLEFILENAMES = JSON.parse(fs.readFileSync(`static/bundle/manifest.json`))
  return BUNDLEFILENAMES
}
