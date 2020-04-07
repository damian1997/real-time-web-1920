export default function(req,res,COMPONENTPATH,BUNDLE) {
  res.render(`${COMPONENTPATH}/base/views/messageboard`, {
    basePartialsPath: `${COMPONENTPATH}/base/views/partials`,
    bundledCSS: BUNDLE['main.css'],
    bundledJS: BUNDLE['main.js']
  })
}

