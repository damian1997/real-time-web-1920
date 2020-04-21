import { generateRandomString } from '../src/scripts/utils'
import querystring from 'querystring'
import dotenv from 'dotenv'
dotenv.config()

export default function(req,res,COMPONENTPATH,BUNDLE, STATE_KEY) {
  const STATE = generateRandomString(16),
    SCOPE = 'user-read-private user-read-email'
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
