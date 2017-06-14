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

let oldestOrderTimestamp

function updateStatus(id) {
  const data = {
    orderId: id
  }

  $.ajax({
    url: `${window.location.origin}/getOrderStatus`,
    method: 'POST',
    dataType: 'json',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: onSuccessStatusUpdate,
    error: onErrorStatusUpdate
  })

}

$(document).ready(function(){

  getParlors()
  getOrders()

  $(document).scroll(function() {
    if( $(document).scrollTop() == ($(document).height() - $(window).height()) ) {
      getOrders(oldestOrderTimestamp)
    }
  })

})

function getParlors() {
  $.ajax({
    url: `${window.location.origin}/getParlors`,
    method: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    success: onSuccessGetParlors,
    error: onErrorGetParlors
  })
}

function onSuccessGetParlors(response) {
  console.log('Ajax Success response: ', response)

  if(response.status === 'success') {
    const allParlors = response.data
    if(allParlors.length > 0) {
      allParlors.forEach(function(val) {
        const option = `<option value="${val._id}">${val.parlorName}</option>`
        $('#parlorId').append(option)
      })
    } else {
      alert('No parlors available. Create parlor first')
    }
  } else {
    console.log('Error ', response.error)
    alert('Some error occurred while loading the available parlors')
  }
}

function onErrorGetParlors(err) {
  console.log('Error in getParlors ajax call: ', err)
  alert('Some error occurred while loading the available parlors')
}

function getOrders(beforeTimestamp) {
  const data = {
    beforeTimestamp: beforeTimestamp
  }

  $.ajax({
    url: `${window.location.origin}/getOrders`,
    method: 'POST',
    dataType: 'json',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: onSuccessGetOrders,
    error: onErrorGetOrders
  })
}

function onSuccessGetOrders(response) {
  if(response.status === 'success') {
    const allOrders = response.data,
      length = allOrders.length
    if(length > 0) {
      oldestOrderTimestamp = allOrders[length-1].createdAt
      allOrders.forEach(function(val) {
        const order = createOrderElement(val)
        $('.allOrders').append(order)
      })
      $('.updateButton').click(function(e) {
        console.log('Update button clicked. id: ', e.target.id)
        updateStatus(e.target.id)
      })
    } else {
      console.log('No (more) orders available')
    }
  } else {
    console.log('Error ', response.error)
    alert('Some error occurred while loading the orders')
  }
}

function onErrorGetOrders(err) {
  console.log('Error in getParlors ajax call: ', err)
  alert('Some error occurred while loading the orders')
}

function createOrderElement(order) {
  const {
    _id,
    createdAt,
    customerName,
    customerAddress,
    customerMobile,
    orderDetails,
    orderStatus,
    statusUpdatedAt
  } = order

  return `
  <div class="card" style="width: 20rem;" id="div${_id}">
    <div class="card-block">
      <p class="card-text">
        Order Created At: ${getDateTime(createdAt)} <br>
        Name: ${customerName} <br>
        Address: ${customerAddress} <br>
        Mobile: ${customerMobile} <br>
        Order: ${orderDetails} <br>
        Status: <span id="status${_id}">${orderStatus}</span> <br>
        Status Updated At: <span id="statusUpdatedAt${_id}">${getDateTime(statusUpdatedAt)}</span>
      </p>
      <button id="${_id}" class="btn btn-primary updateButton" type="button">Refresh status</button>
    </div>
  </div>
  `
}

function onSuccessStatusUpdate(response) {
  if(response.status === 'success') {
    const statusDetails = response.data,
      { _id,
        orderStatus,
        statusUpdatedAt
      } = statusDetails

    $(`#status${_id}`).text(orderStatus)
    $(`#statusUpdatedAt${_id}`).text(getDateTime(statusUpdatedAt))

  } else {
    console.log('Error ', response.error)
    alert('Some error occurred while updating status of order')
  }
}

function onErrorStatusUpdate(err) {
  console.log('Error in getParlors ajax call: ', err)
  alert('Some error occurred while updating status of order')
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

$('#form').submit(function(e){
  e.preventDefault()
  const customerName = $('#customerName').val(),
    customerAddress = $('#customerAddress').val(),
    customerMobile = $('#customerMobile').val(),
    orderDetails = $('#orderDetails').val(),
    parlorId = $('#parlorId option:selected').val()

  const data = {
    customerName: customerName,
    customerAddress: customerAddress,
    customerMobile: customerMobile,
    orderDetails: orderDetails,
    parlorId: parlorId
  }

  console.log(data)

  for(let key in data) {
    if(data[key] === '' || !data[key]) {
      alert('Fill in all fields!')
      return
    }
  }

  if(!(/^\d{10}$/.test(customerMobile))) {
    alert(`Mobile number should be 10 digits. Don't include country codes`)
    return
  }

  var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$")
  if(!checkForHexRegExp.test(data.parlorId)) {
    alert('Not a valid ID for the parlor name')
    return
  }

  $.ajax({
    url: `${window.location.origin}/createOrder`,
    method: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: onSuccessCreateOrderFunc,
    error: onErrorCreateOrderFunc
  })
})

function onSuccessCreateOrderFunc(response) {
  if(response.status === 'success') {
    console.log('Success response: ', response)
    if(response.message === Constants.ORDER_CREATED){
      alert(Constants.ORDER_CREATED)
      const order = createOrderElement(response.data)
      $('.allOrders').prepend(order)
      $('.updateButton').click(function(e) {
        console.log('Update button clicked. id: ', e.target.id)
        updateStatus(e.target.id)
      })
    } else {
      console.log('Unknown message')
      alert('Unknown error has occurred while creating user')
    }
  } else {
    console.log('Error response: ', response)

    if(response.error === Constants.PARLOR_DOESNT_EXIST) {
      alert(Constants.PARLOR_DOESNT_EXIST)
    } else {
      alert('Unknown error has occurred while creating order')
    }
  }

}

function onErrorCreateOrderFunc(err) {
  console.log('Error in ajax call: ', err)
  alert('Some error in sending request to server')
}

},{"../../Constants":1}]},{},[2]);
