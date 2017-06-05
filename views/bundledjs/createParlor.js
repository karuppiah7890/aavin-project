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
  $('#form').submit(function(e){
    e.preventDefault()
    const parlorName = $('#parlorName').val()

    if(parlorName === '') {
      alert('Fill in the parlor name!')
      return
    }

    const data = {
      parlorName: parlorName
    }

    $.ajax({
      url: `${window.location.origin}/createParlor`,
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: onSuccessFunc,
      error: onErrorFunc
    })
  })

  function onSuccessFunc(response) {
    if(response.status === 'success') {
      console.log('Success response: ', response)

      if(response.message === Constants.PARLOR_CREATED){
        alert(Constants.PARLOR_CREATED)
      } else {
        console.log('Unknown message')
        alert('Unknown error has occurred while creating parlor')
      }
    } else {
      console.log('Error response: ', response)

      if(response.error === Constants.PARLOR_ALREADY_EXISTS) {
        alert(Constants.PARLOR_ALREADY_EXISTS)
      } else {
        console.log('Unknown message')
        alert('Unknown error has occurred while creating parlor')
      }
    }

  }

  function onErrorFunc(err) {
    console.log('Error in ajax call: ', err)
    alert('Some error in sending request to server')
  }

})

},{"../../Constants":1}]},{},[2]);
