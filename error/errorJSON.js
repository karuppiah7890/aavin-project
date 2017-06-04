module.exports = {
  accessDenied: function(roleCanAccess) {
    return {
      status: 'error',
      error: `You are not allowed to access this URL. Only ${roleCanAccess} can access this URL.`
    }
  },
  errorOccurred: function(err) {
    return {
      status: 'error',
      error: err
    }
  }
}
