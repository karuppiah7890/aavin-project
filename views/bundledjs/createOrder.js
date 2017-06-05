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

$(document).ready(function(){

  getParlors();

  function getParlors() {
    $.ajax({
      url: `${window.location.origin}/getParlors`,
      method: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      success: onSuccessGetParlor,
      error: onErrorGetParlor
    })
  }

  function onSuccessGetParlor(response) {
    console.log('Ajax Success response: ', response)

    if(response.status === 'success') {
      if(response.data.length > 0) {
        $('#parlorId option').remove()
        response.data.forEach(function(val) {
          const option = `<option value="${val._id}">${val.parlorName}</option>`
          $('#parlorId').append(option)
        })
        $('.parlorSelect').show();
      } else {
        alert('No parlors available. Create parlor first')
      }
    }
  }

  function onErrorGetParlor(err) {
    console.log('Error in getParlors ajax call: ', err)
    alert('Some error occurred while loading the available parlors')
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

    var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    if(!checkForHexRegExp.test(data.parlorId)) {
      alert('Not a valid ID for the parlor name')
      return;
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

})

},{"../../Constants":1}]},{},[2]);
