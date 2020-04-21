export default function(req,res,COMPONENTPATH,BUNDLE) {
  console.log(req.cookies)
  res.render(`${COMPONENTPATH}/base/views/home`, {
    bundledCSS: BUNDLE['main.css'],
    bundledJS: BUNDLE['main.js']
  })
}
