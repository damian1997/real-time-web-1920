import querystring from 'querystring'
import request from 'request'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { generateRandomString } from '../src/scripts/utils'

dotenv.config()

export function login(req,res,STATE_KEY) {
  const STATE = generateRandomString(16),
    SCOPE = 'streaming user-modify-playback-state app-remote-control user-read-private user-read-email user-read-currently-playing user-read-playback-state'
  res.cookie(STATE_KEY, STATE)

  // Application request authorization
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.CLIENT_ID,
      scope: SCOPE,
      redirect_uri: process.env.REDIRECT_URI,
      state: STATE
    })
  )
}

export function callback(req,res,STATE_KEY) {
  const CODE = req.query.code || null,
    STATE = req.query.state || null,
    STOREDSTATE = req.cookies ? req.cookies[STATE_KEY] : null

  if(STATE === null || STATE !== STOREDSTATE) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      })
    )
  } else {
    // CLEAR THE OLD KEY
    res.clearCookie(STATE_KEY)

    const AUTHOPTIONS = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: CODE,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(process.env.CLIENT_ID+ ':' + process.env.CLIENT_SECRET).toString('base64'))
      },
      json: true
    }

    request.post(AUTHOPTIONS, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        let access_token = body.access_token,
          refresh_token = body.refresh_token


        let options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        }


        //https://api.spotify.com/v1/me 
        const profile = fetch("https://api.spotify.com/v1/me", {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
          }
        }).then(response => {
          let data = response.json()
          return data
        }).catch(error => {
          console.log(error)
        })

        res.cookie('access_token',access_token)

        Promise.resolve(profile).then((data) => {
          res.cookie('user', {id: data.id, display_name: data.display_name})

          res.redirect('/#' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token
            }))
        })

      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }))
      }
    })
  }
}

export function refreshToken(req,res) {
  const refresh_token = req.query.refresh_token
  const AUTHOPTIONS = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(process.env.CLIENT_ID+ ':' + process.env.CLIENT_SECRET).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  }

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token
      res.send({
        'access_token': access_token
      })
    }
  })
}
