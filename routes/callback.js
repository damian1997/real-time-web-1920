import querystring from 'querystring'
import request from 'request'
import dotenv from 'dotenv'
dotenv.config()


export default function(req,res,COMPONENTPATH,BUNDLE, STATE_KEY) {
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

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body)
        })

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }))
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }))
      }
    })
  }
}
