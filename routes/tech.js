export default function(req,res,COMPONENTPATH,BUNDLE) {
  res.render(`${COMPONENTPATH}/tech/views/tech`, {
    basePartialsPath: `${COMPONENTPATH}/base/views/partials`,
    bundledCSS: BUNDLE['main.css'],
    bundledJS: BUNDLE['main.js']
  })
}
