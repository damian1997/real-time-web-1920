import querystring from 'querystring'
import request from 'request'
import dotenv from 'dotenv'
dotenv.config()


export default function(req,res,COMPONENTPATH,BUNDLE, STATE_KEY) {
   // requesting access token from refresh token
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
