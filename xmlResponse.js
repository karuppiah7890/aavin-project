const xmlbuilder = require('xmlbuilder')

const root = xmlbuilder.create('Response')

module.exports = {
  addHangup: (attrs) => {
    root.ele('Hangup', attrs)
  },
  addDial: () => {

  },
  addUser: () => {
    
  },
  addNumber: () => {

  }
}
