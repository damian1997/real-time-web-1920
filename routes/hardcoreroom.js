import SpotifyWebApi from 'spotify-web-api-node'
import dotenv from 'dotenv'
import { cleanPlaylistData } from '../src/scripts/data'
dotenv.config()


export default async function(req,res,COMPONENTPATH,BUNDLE) {
  const spotifyApi = new SpotifyWebApi()
  spotifyApi.setAccessToken(req.cookies.access_token)

  const playlist = await spotifyApi.getPlaylist('6oqxomxWwXLx8Jz2mog7Nw')
    .then(data => {
      return cleanPlaylistData(data.body)
    })
    .catch(error => {
    })
  
  res.render(`${COMPONENTPATH}/rooms/views/room`, {
    bundledCSS: BUNDLE['main.css'],
    bundledJS: BUNDLE['main.js'],
    basePartialsPath: `${COMPONENTPATH}/base/views/partials`,
    playlist_data: playlist
  })

}
