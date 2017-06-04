module.exports = function(PORT){
  return {
    development: {
      serverUrl: `http://localhost:${PORT}`,
      mongoUrl: process.env.MONGODB_URI + '/aavin'
    },
    production: {
      serverUrl: 'https://aavin.herokuapp.com',
      mongoUrl: process.env.MONGODB_URI
    }
  }
}
