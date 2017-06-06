const PORT = process.env.PORT || 3000

const config = require('./config')(PORT)[process.env.APP_ENV]

const express = require('express')
const app = express()
const db = require('./db')(config)
const bodyparser = require('body-parser')
const nunjucks = require('nunjucks')
const ensureLogin = require('connect-ensure-login')
const auth = require('./auth')(config)
const parlorRoutes = require('./routes/parlorRoutes')
const dialRoutes = require('./routes/dialRoutes')
const userRoutes = require('./routes/userRoutes')
const orderRoutes = require('./routes/orderRoutes')
const logRoutes = require('./routes/logRoutes')
const flash = require('connect-flash')

nunjucks.configure('views', {
  express: app
})

app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(require('body-parser').json())
app.use(require('express-session')({ secret: 'horsehasalegandlionhasatail', resave: false, saveUninitialized: false }))
app.use(flash())
app.use('/static', express.static('static'))
app.use('/bundledjs', express.static('views/bundledjs'))
app.use('/css', express.static('views/css'))

auth.init(app)

app.get('/', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  if(req.user.role === 'admin')
    res.render('admin.html')

  else if(req.user.role === 'parlor_staff')
    res.render('parlorStaff.html')

  else if(req.user.role === 'support_staff')
    res.render('supportStaff.html')

  else{
    console.log('Undefined/Unknown role. User: ', req.user)
    res.status(500).send('Some internal error occurred.')
  }
})

app.get('/call', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  if(req.user.role === 'support_staff')
  res.render('call.html', {
    username: process.env.PLIVO_SIP_ENDPOINT_USERNAME,
    password: process.env.PLIVO_SIP_ENDPOINT_PASSWORD
  })

  else {
    res.status(403).send('You are not allowed to access this page. Only Support staff can access this page.');
    return
  }
})

app.get('/receive', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  if(req.user.role === 'support_staff')
  res.render('receive.html', {
    username: process.env.PLIVO_SIP_ENDPOINT_USERNAME,
    password: process.env.PLIVO_SIP_ENDPOINT_PASSWORD
  })

  else {
    res.status(403).send('You are not allowed to access this page. Only Support staff can access this page.');
    return
  }

})

parlorRoutes.routes(app)
dialRoutes.routes(app)
userRoutes.routes(app)
orderRoutes.routes(app)
logRoutes.routes(app)

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`)
})
