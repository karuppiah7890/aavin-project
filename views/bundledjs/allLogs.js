(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  PARLOR_CREATED: 'Parlour Created',
  PARLOR_ALREADY_EXISTS: 'Parlor already exists',
  PARLOR_DOESNT_EXIST: `Parlor doesn't exist`,
  USER_ALREADY_EXISTS: 'User already exists',
  USER_CREATED: 'User Created',
  ORDER_CREATED: 'Order Created',
}

},{}],2:[function(require,module,exports){
const Constants = require('../../Constants')

let latestLogTimestamp, oldestLogTimestamp

$(document).ready(function(){

  getLogs()

  $(document).scroll(function() {
    if( $(document).scrollTop() == ($(document).height() - $(window).height()) ) {
      getLogs(oldestLogTimestamp)
    }
  })

  $('#getNewLogs').click(function() {
    getNewLogs(latestLogTimestamp)
  })

})

function getNewLogs(afterTimestamp) {
  const data = {
    afterTimestamp: afterTimestamp
  }

  $.ajax({
    url: `${window.location.origin}/getLogs`,
    method: 'POST',
    dataType: 'json',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: onSuccessGetNewLogs,
    error: onErrorGetNewLogs
  })
}

function onSuccessGetNewLogs(response) {
  if(response.status === 'success') {
    const allLogs = response.data,
      length = allLogs.length
    if(length > 0) {
      latestLogTimestamp = allLogs[0].time
      allLogs.reverse().forEach(function(val) {
        const log = createLogElement(val)
        $('.allLogs').prepend(log)
      })
    } else {
      console.log('No new logs available')
    }
  } else {
    console.log('Error ', response.error)
    alert('Some error occurred while loading the new logs')
  }
}

function onErrorGetNewLogs(err) {
  console.log('Error in getParlors ajax call: ', err)
  alert('Some error occurred while loading the new logs')
}

function getLogs(beforeTimestamp) {
  const data = {
    beforeTimestamp: beforeTimestamp
  }

  $.ajax({
    url: `${window.location.origin}/getLogs`,
    method: 'POST',
    dataType: 'json',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: onSuccessGetLogs,
    error: onErrorGetLogs
  })
}

function onSuccessGetLogs(response) {
  if(response.status === 'success') {
    const allLogs = response.data,
      length = allLogs.length
    if(length > 0) {
      if(!latestLogTimestamp)
      latestLogTimestamp = allLogs[0].time

      oldestLogTimestamp = allLogs[length-1].time
      allLogs.forEach(function(val) {
        const log = createLogElement(val)
        $('.allLogs').append(log)
      })
    } else {
      console.log('No (more) logs available')
    }
  } else {
    console.log('Error ', response.error)
    alert('Some error occurred while loading the logs')
  }
}

function onErrorGetLogs(err) {
  console.log('Error in getParlors ajax call: ', err)
  alert('Some error occurred while loading the logs')
}

function createLogElement(log) {
  const {
    username,
    displayName,
    role,
    logDetail,
    time
  } = log

  const logDetailString = (logDetail === 'in')? 'logged in' : 'logged out'

  return `
    <div>
      ${displayName} (${username}) ${logDetailString} at ${getDateTime(time)}
    </div> <br><br>
  `
}

function padZeros(val) {
  if(val < 10)
    return `0${val}`
  else
    return val
}

function getDateTime(dateTimeString) {
  const dateTime = new Date(dateTimeString),
    hh = padZeros(dateTime.getHours()),
    mm = padZeros(dateTime.getMinutes()),
    DD = padZeros(dateTime.getDate()),
    MM = padZeros(dateTime.getMonth()),
    YYYY = dateTime.getFullYear()

  return `${hh}:${mm} ${DD}-${MM}-${YYYY}`
}

},{"../../Constants":1}]},{},[2]);
