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

let latestOrderTimestamp, oldestOrderTimestamp

function updateStatus(id) {

  const orderStatus = $(`#status${id} option:selected`).val()

  const data = {
    orderId: id,
    orderStatus: orderStatus
  }

  if(orderStatus === '' || (['taken', 'confirmed', 'delivered'].indexOf(orderStatus) === -1))
  alert('Invalid status')

  $.ajax({
    url: `${window.location.origin}/setOrderStatus`,
    method: 'POST',
    dataType: 'json',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: onSuccessStatusUpdate,
    error: onErrorStatusUpdate
  })

}

$(document).ready(function(){

  getOrders()

  $(document).scroll(function() {
    if( $(document).scrollTop() == ($(document).height() - $(window).height()) ) {
      getOrders(oldestOrderTimestamp)
    }
  })

  $('#getNewOrders').click(function() {
    getNewOrders(latestOrderTimestamp)
  })

})

function getNewOrders(afterTimestamp) {
  const data = {
    afterTimestamp: afterTimestamp
  }

  $.ajax({
    url: `${window.location.origin}/getOrders`,
    method: 'POST',
    dataType: 'json',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: onSuccessGetNewOrders,
    error: onErrorGetNewOrders
  })
}

function onSuccessGetNewOrders(response) {
  if(response.status === 'success') {
    const allOrders = response.data,
      length = allOrders.length
    if(length > 0) {
      latestOrderTimestamp = allOrders[0].createdAt
      allOrders.reverse().forEach(function(val) {
        const order = createOrderElement(val)
        $('.allOrders').prepend(order)
        $(`#status${order._id}`).val(val.orderStatus)
      })
      $('.updateButton').click(function(e) {
        console.log('Update button clicked. id: ', e.target.id)
        updateStatus(e.target.id)
      })
    } else {
      console.log('No new orders available')
    }
  } else {
    console.log('Error ', response.error)
    alert('Some error occurred while loading the new orders')
  }
}

function onErrorGetNewOrders(err) {
  console.log('Error in getParlors ajax call: ', err)
  alert('Some error occurred while loading the new orders')
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
      if(!latestOrderTimestamp)
      latestOrderTimestamp = allOrders[0].createdAt
      oldestOrderTimestamp = allOrders[length-1].createdAt
      allOrders.forEach(function(val) {
        const order = createOrderElement(val)
        $('.allOrders').append(order)
        $(`#status${val._id}`).val(val.orderStatus)
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
    <div id="div${_id}">
      Order Created At: ${getDateTime(createdAt)} <br>
      Name: ${customerName} <br>
      Address: ${customerAddress} <br>
      Mobile: ${customerMobile} <br>
      Order: ${orderDetails} <br>
      Status:
      <select id="status${_id}">
        <option value="taken">Taken</option>
        <option value="confirmed">Confirmed</option>
        <option value="delivered">Delivered</option>
      </select>
      <button id="${_id}" class="updateButton" type="button">Update Status</button> <br>
      Status Updated At: <span id="statusUpdatedAt${_id}">${getDateTime(statusUpdatedAt)}</span>
    </div> <br><br>
  `
}

function onSuccessStatusUpdate(response) {
  if(response.status === 'success') {
    const statusDetails = response.data,
      { _id,
        orderStatus,
        statusUpdatedAt
      } = statusDetails

    $(`#status${_id}`).val(orderStatus)
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

},{"../../Constants":1}]},{},[2]);
