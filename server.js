const PORT = process.env.PORT || 3000

const config = require('./config')(PORT)[process.env.APP_ENV]

const express = require('express')
const app = express()
const db = require('./db')(config)
const bodyparser = require('body-parser')
const plivo = require('plivo')
const nunjucks = require('nunjucks')
const ensureLogin = require('connect-ensure-login')
const auth = require('./auth')(config)
const flash = require('connect-flash')

nunjucks.configure('views', {
  express: app
})

app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(require('express-session')({ secret: 'horsehasalegandlionhasatail', resave: false, saveUninitialized: false }))
app.use(flash())
app.use('/static', express.static('static'))
app.use('/js', express.static('views/js'))
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

app.get('/order', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  if(req.user.role === 'support_staff')
    res.render('take-order.html')
  else
    res.status(403).send('You are not allowed to access this page');
})

app.post('/order', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  //if(req.user.role === 'support_staff') {  }
})

app.use('/direct-dial', (req, res) => {
  console.log(JSON.stringify(req.body, null, 2))
  try {

    const {
      ForwardTo,
      To,
      CLID,
      From,
      DialMusic,
      DisableCall,
      CallerName,
      HangupCause
    } = req.body

    const to = ForwardTo || To,
      from = CLID || From

    if(HangupCause) {
      res.send('SIP Route Hangup Callback')
      return
    }

    const xmlResponse = plivo.Response()
    let isSipUser

    if(!to) {
      console.log('SIP Route cannot identify destination number')
      xmlResponse.addHangup()
    } else {
      isSipUser = (to.substr(0,4) === 'sip:')

      if(isSipUser && (['all', 'sip'].indexOf(DisableCall) !== -1)) {
        console.log(`SIP Route calling sip user is disabled : ${DisableCall}`)
        xmlResponse.addHangup({
          reason: 'busy'
        })
      } else if(isSipUser && (['all', 'number'].indexOf(DisableCall) !== -1)) {
        console.log(`SIP Route calling number is disabled : ${DisableCall}`)
        xmlResponse.addHangup({
          reason: 'busy'
        })
      } else {
        console.log(`SIP Route dialing to ${to}`)
        let dial

        if(!DialMusic) {
          dial = xmlResponse.addDial({
            callerId: from,
            callerName: CallerName
          })
        } else {
          dial = xmlResponse.addDial({
            callerId: from,
            callerName: CallerName,
            dialMusic: DialMusic
          })
        }

        isSipUser? dial.addUser(to) : dial.addNumber(to)
      }
    }

    res.set('Content-Type', 'text/xml')
    res.send(xmlResponse.toXML())
  } catch(err) {
    console.log(`An error occured! ${err}`)
    res.status(500).send('Internal error')
  }
})

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`)
})
