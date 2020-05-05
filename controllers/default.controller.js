export function home(req,res,COMPONENTPATH,BUNDLE) {
  if(!req.cookies.access_token) {
    // not logged in to spotify
    res.render(`${COMPONENTPATH}/base/views/home`, {
      logged_in: false,
      bundle_css: BUNDLE['main.css'],
      bundle_js: BUNDLE['main.js'],
    })
  } else {
    // logged in to spotify
    res.render(`${COMPONENTPATH}/base/views/home`, {
      logged_in: true,
      bundle_css: BUNDLE['main.css'],
      bundle_js: BUNDLE['main.js'],
    })
  }
}
