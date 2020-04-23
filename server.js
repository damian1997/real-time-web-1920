import express from 'express'
import compression from 'compression'
import request from 'request'
import cors from 'cors'
import querystring from 'querystring'
import cookieParser from 'cookie-parser'

import fs from 'fs'
import * as http from 'http';
import socketIO from 'socket.io'
import { generateRandomString } from './src/scripts/utils'

// SETTINGS
const PORT = process.env.PORT ||  8888,
  APP = express(),
  SERVER = http.createServer(APP),
  IO = new socketIO(SERVER),
  COMPONENTPATH = `${__dirname}/src/components`,
  BUNDLE = getBundleUrls(),
  STATE_KEY = 'spotify_auth_state'

// IO NAMESPACES
const NAMESPACES = {
  default: IO.of('/'),
  hardcore_room: IO.of('/hardcore_room')
}

let que = []

APP
  .use(compression())
  .use(express.static('static'))
  .use(cors())
  .use(cookieParser())
  .set('view engine', 'ejs')
  .set('views', 'src/components')
  .set('trust proxy', 1)


// ROUTES
import home from './routes/home.js'
import login from './routes/login.js'
import callback from './routes/callback.js'
import refresh_token from './routes/refreshtoken.js'
import hardcore_room from './routes/hardcoreroom'

APP
  .get('/', (req,res) => home(req,res,COMPONENTPATH,BUNDLE))
  .get('/login', (req, res) => login(req,res,COMPONENTPATH,BUNDLE,STATE_KEY))
  .get('/callback', (req, res) => callback(req,res,COMPONENTPATH,BUNDLE,STATE_KEY))
  .get('/refresh_token', (req, res) => refresh_token(req,res,COMPONENTPATH,BUNDLE,STATE_KEY))
  .get('/hardcore_room', (req,res) => hardcore_room(req,res,COMPONENTPATH,BUNDLE,que))

NAMESPACES.hardcore_room.on('connection', (socket) => {
  socket.on('add_track_to_que', track => {
    que.push(track)
    console.log(que)
  })
})

SERVER.listen(PORT, () => console.log(`Using port: ${PORT}`))

function getBundleUrls() {
  const BUNDLEFILENAMES = JSON.parse(fs.readFileSync(`static/bundle/manifest.json`))
  return BUNDLEFILENAMES
}
