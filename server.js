import express from 'express'
import compression from 'compression'
import fs from 'fs'

const PORT = process.env.PORT || 4000,
      app = express(),
      COMPONENTPATH = `${__dirname}/src/components`,
      BUNDLE = getBundleUrls()

app
  .use(compression())
  .use(express.static('static'))
  .set('view engine', 'ejs')
  .set('views', 'src/components')
  .set('trust proxy', 1)


// ROUTES
import home from './routes/home.js'

app
  .get('/', (req,res) => home(req,res,COMPONENTPATH,BUNDLE))
  .listen(PORT, () => console.log(`Using port: ${PORT}`))

function getBundleUrls() {
  const BUNDLEFILENAMES = JSON.parse(fs.readFileSync(`static/bundle/manifest.json`))
  return BUNDLEFILENAMES
}
