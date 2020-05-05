import fetch from 'node-fetch'

const rooms = [] 

export function init(IO) {
  IO.on('connection', (socket) => {
    socket.on('new-user', (user,roomid) => {
      socket.join(roomid)
      
      socket.to(roomid).broadcast.emit('user-joined', user)
    })
  })
}

export async function createRoom(req,res,COMPONENTPATH,BUNDLE) {
  const profile = await fetch("https://api.spotify.com/v1/me", {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${req.cookies.access_token}`
    }
  }).then(response => {
    let data = response.json()
    return data
  })
  
  let profile_playlists = await fetch(`https://api.spotify.com/v1/users/${profile.id}/playlists`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${req.cookies.access_token}`
    }
  }).then(response => {
    let data = response.json()
    return data
  })

  res.render(`${COMPONENTPATH}/rooms/views/create`, {
    user_profile: (profile) ? profile : `Something went wrong trying to fetch your profile`,
    playlists: (profile_playlists) ? profile_playlists : `No playlists found for your profile ${profile.display_name}`,
    bundle_css: BUNDLE['main.css'],
    bundle_js: BUNDLE['main.js'],
    base_partial_path: `${COMPONENTPATH}/base/views/partials`
  })
}

// Setup for party room creation
export function setupRoom(req,res,IO,COMPONENTPATH) {
  const room_exists = rooms.find(room => {
    return room.id === req.query.roomid
  })

  if(room_exists) {
    res.redirect(`/party-room/${req.query.roomid}`) 
  }

  const room = new Object()
  room.id = req.query.roomid
  room.users = []
  room.users.push(req.cookies.user)
  rooms.push(room)
  res.redirect(`/party-room/${req.query.roomid}`)
}

// Functionality for joining party room
export function joinRoom(req,res,IO) {
  const room_exists_index = rooms.findIndex(room => {
    return room.id === req.query.roomid
  })
  if(room_exists_index != -1) {
    console.log(req.cookies.user)
    rooms[room_exists_index].users.push(req.cookies.user)

    res.redirect(`/party-room/${req.query.roomid}`)
  } else {
    // TODO Error handling if room does not exist
  }
}

export function room(req,res,IO,COMPONENTPATH,BUNDLE) {
  const room = rooms.find(room => {
    return room.id === req.params.id
  })

  console.log(room.users)
  res.render(`${COMPONENTPATH}/rooms/views/room`, {
    spotify_token: req.cookies.access_token,
    playlist: req.params.id,
    users: room.users,
    bundle_css: BUNDLE['main.css'],
    bundle_js: BUNDLE['main.js'],
    base_partial_path: `${COMPONENTPATH}/base/views/partials`
  })
}
