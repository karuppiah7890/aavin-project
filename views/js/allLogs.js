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
