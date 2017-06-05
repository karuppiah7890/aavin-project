(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Answer incoming calls
function answer() {
    console.log("answering")
    $('#status_txt').text('Answering....');
    Plivo.conn.answer();
    $('#status_txt').text('Answered the Call');
    $('#btn-container').show();
    $('#incoming_callbox').hide();
}
// Reject incoming calls
function reject() {
    $('#status_txt').text('Rejected the Call');
    Plivo.conn.reject();
    $('#btn-container').hide();
    $('#incoming_callbox').hide();
    $('#status_txt').text('Ready');
}
// Incoming calls
function onIncomingCall(account_name, extraHeaders) {
    console.log("onIncomingCall:"+account_name);
    console.log("extraHeaders=");
    for (var key in extraHeaders) {
        console.log("key="+key+".val="+extraHeaders[key]);
    }
    $('#status_txt').text('Incoming Call');
    $('#incoming_callbox').show('slow');
}
function  onMediaPermission (result) {
    if (result) {
        console.log("get media permission");
    } else {
        alert("you don't allow media permission, you will can't make a call until you allow it");
    }
}
function onCallTerminated() {
    console.log("onCallTerminated");
}
function webrtcNotSupportedAlert() {
    $('#txtStatus').text("");
    alert("Your browser doesn't support WebRTC. You need Chrome 25 to use this demo");
}
function onLogin() {
    $('#status_txt').text('Logged in');
}
function onLoginFailed() {
    $('#status_txt').text("Login Failed");
}
function onReady() {
    console.log("onReady...");
    login();
}
function mute() {
    Plivo.conn.mute();
    $('#linkUnmute').show('slow');
    $('#linkMute').hide('slow');
}
function unmute() {
    Plivo.conn.unmute();
    $('#linkUnmute').hide('slow');
    $('#linkMute').show('slow');
}
function hangup() {
    $('#status_txt').text('Hanging up..');
    Plivo.conn.hangup();
    $('#btn-container').hide();
    $('#incoming_callbox').hide();
    $('#status_txt').text('Ready');
}
function dtmf(digit) {
    console.log("send dtmf="+digit);
    Plivo.conn.send_dtmf(digit);
}
// Initialization
$(document).ready(function() {
    Plivo.onWebrtcNotSupported = webrtcNotSupportedAlert;
    Plivo.onReady = onReady;
    Plivo.onLogin = onLogin;
    Plivo.onLoginFailed = onLoginFailed;
    Plivo.onCallTerminated = onCallTerminated;
    Plivo.onIncomingCall = onIncomingCall;
    Plivo.onMediaPermission = onMediaPermission;
    Plivo.init();
});

},{}]},{},[1]);
