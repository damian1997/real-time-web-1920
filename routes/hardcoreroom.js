import SpotifyWebApi from 'spotify-web-api-node'
import dotenv from 'dotenv'
dotenv.config()


export default function(req,res,COMPONENTPATH,BUNDLE) {
  const spotifyApi = new SpotifyWebApi()
  console.log(req.cookies)
  spotifyApi.setAccessToken(req.cookies.access_token)

  spotifyApi.getPlaylist('6oqxomxWwXLx8Jz2mog7Nw')
    .then(data => {
      console.log(data.body.tracks.items[0])
    })
    .catch(error => {
      console.log(error)
    })

  res.render(`${COMPONENTPATH}/base/views/home`, {
    bundledCSS: BUNDLE['main.css'],
    bundledJS: BUNDLE['main.js']
  })
}
