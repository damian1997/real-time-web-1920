import fetch from 'node-fetch'

const rooms = [] 

export function init(IO) {
  IO.on('connection', (socket) => {
    socket.on('new-user', (user,roomid) => {
      const room_index = findRoomIndex(roomid)
      rooms[room_index].users.push({socket_id: socket.id, spotify_id: user.spotify_id, display_name: user.display_name})
      
      socket.join(roomid)
      socket.to(roomid).broadcast.emit('user-joined', user)
    })

    socket.on('disconnect', () => {
      if(rooms.length) {
        const users_room = rooms.find(room => {
          const user = room.users.find(user => {
            return user.socket_id === socket.id
          })
          
          if(user !== undefined) {
            return room
          } else {
            return undefined
          }
        })

        if(users_room) {
          const room_index = findRoomIndex(users_room.id)
          const user_index = findUserIndex(room_index, socket.id)
          
          IO.to(users_room.id).emit('user-left', rooms[room_index].users[user_index])
          
          rooms[room_index].users.splice(user_index,1)
        }
      }
    })

    socket.on('track-added-to-que', (params) => {
      IO.to(params.room).emit('track-added-succes', params.track)
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
    sdk: false,
    user_profile: (profile) ? profile : `Something went wrong trying to fetch your profile`,
    playlists: (profile_playlists) ? profile_playlists : `No playlists found for your profile ${profile.display_name}`,
    bundle_css: BUNDLE['main.css'],
    bundle_js: BUNDLE['main.js'],
    base_partial_path: `${COMPONENTPATH}/base/views/partials`
  })
}

// Setup for party room creation
export function setupRoom(req,res,IO,COMPONENTPATH) {
  const room_index = findRoomIndex(req.query.roomid)

  if(room_index) {
    res.redirect(`/party-room/${req.query.roomid}`) 
  }

  console.log('foo ',req.cookies.access_token)

  const room = new Object()
  room.token = req.cookies.access_token,
  room.id = req.query.roomid
  room.users = []
  rooms.push(room)
  res.redirect(`/party-room/${req.query.roomid}`)
}

// Functionality for joining party room
export function joinRoom(req,res,IO) {
  const room_index = findRoomIndex(req.query.roomid)

  if(room_index != -1) {
    res.redirect(`/party-room/${req.query.roomid}`)
  } else {
    // TODO Error handling if room does not exist
  }
}

export function room(req,res,IO,COMPONENTPATH,BUNDLE) {
  const room = rooms.find(room => {
    return room.id === req.params.id
  })

  const room_index = findRoomIndex(req.params.id) 

  const filtered_users = room.users.filter(user => {
    return user.spotify_id !== req.cookies.user.spotify_id
  })
 
  res.render(`${COMPONENTPATH}/rooms/views/room`, {
    spotify_token: req.cookies.access_token,
    room_token: rooms[room_index].token,
    room_id: req.params.id,
    sdk: true,
    playlist: req.params.id,
    self: req.cookies.user,
    users: filtered_users,
    bundle_css: BUNDLE['main.css'],
    bundle_js: BUNDLE['main.js'],
    base_partial_path: `${COMPONENTPATH}/base/views/partials`
  })
}

function findRoomIndex(roomToCheck) {
  const room_index = rooms.findIndex(room => {
    return room.id === roomToCheck 
  })

  return room_index
}

function findUserIndex(room_index, socket_id) {
  const user_index = rooms[room_index].users.findIndex(user => {
    return user.socket_id === socket_id
  })
  return user_index
}
