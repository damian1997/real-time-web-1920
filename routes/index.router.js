import * as  base from '../controllers/default.controller'
import * as socket from '../controllers/socket.controller'
import * as spotifyApi from '../controllers/spotify.controller'

export default function(APP,IO,{COMPONENTPATH, STATE_KEY, BUNDLE}) {
  APP.get('/', (req,res) => {
    base.home(req,res,COMPONENTPATH,BUNDLE)
  })

  APP.get('/create-room', (req,res) => {
    socket.createRoom(req,res,COMPONENTPATH,BUNDLE)
  })

  APP.get('/setup-room', (req,res) => {
    socket.setupRoom(req,res,IO)
  })

  APP.get('/party-room/:id', (req,res) => {
    socket.room(req,res,IO,COMPONENTPATH,BUNDLE) 
  })

  APP.get('/join-room', (req,res) => {
    socket.joinRoom(req,res,IO)
  })

  APP.get('/login', (req,res) => {
    spotifyApi.login(req,res,STATE_KEY)
  })

  APP.get('/callback', (req,res) => {
    spotifyApi.callback(req,res,STATE_KEY)
  })

  APP.get('/refresh-token', (req,res) => {
    spotifyApi.refreshToken(req,res)
  })

  socket.init(IO)
}
