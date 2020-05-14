import express from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import request from 'request'
import cors from 'cors'
import router from './routes/index.router'
import * as http from 'http';
import socketIO from 'socket.io'
import bodyParser from 'body-parser'
import fs from 'fs'

// SETTINGS
const PORT = process.env.PORT ||  8888,
  APP = express(),
  SERVER = http.createServer(APP),
  IO = new socketIO(SERVER),
  COMPONENTPATH = `${__dirname}/src/components`,
  STATE_KEY = 'spotify_auth_state',
  BUNDLE = getBundleUrls(),
  urlencodedParser = bodyParser.urlencoded({ extended: true })

APP
  .use(compression())
  .use(express.static('static'))
  .use(cors())
  .use(cookieParser('somesecret'))
  .use(bodyParser.json())
  .use(urlencodedParser)
  .set('view engine', 'ejs')
  .set('views', 'src/components')

SERVER.listen(PORT, () => console.log(`Using port: ${PORT}`))
router(APP,IO,{COMPONENTPATH, STATE_KEY, BUNDLE})

function getBundleUrls() {
  const BUNDLEFILENAMES = JSON.parse(fs.readFileSync(`static/bundle/manifest.json`))
  return BUNDLEFILENAMES
}
