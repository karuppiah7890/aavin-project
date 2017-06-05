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

app.get('/call', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  res.render('call.html', {
    username: process.env.PLIVO_SIP_ENDPOINT_USERNAME,
    password: process.env.PLIVO_SIP_ENDPOINT_PASSWORD
  })
})

app.get('/receive', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  res.render('receive.html', {
    username: process.env.PLIVO_SIP_ENDPOINT_USERNAME,
    password: process.env.PLIVO_SIP_ENDPOINT_PASSWORD
  })
})

parlorRoutes.routes(app)
dialRoutes.routes(app)
userRoutes.routes(app)
orderRoutes.routes(app)

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`)
})
