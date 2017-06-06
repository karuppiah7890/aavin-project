(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Make outgoing calls
function call() {
    if ($('#make_call').text() == "Call") {
        // The destination phone number to connect the call to
        var dest = $("#to").val();
        if (isNotEmpty(dest)) {
            $('#status_txt').text('Calling..');
            // Connect the call
            Plivo.conn.call(dest);
            $('#make_call').text('End');
        }
        else{
            $('#status_txt').text('Invalid Destination');
        }
    }
    else if($('#make_call').text() == "End") {
        $('#status_txt').text('Ending..');
        // Hang up the call
        Plivo.conn.hangup();
        $('#make_call').text('Call');
        $('#status_txt').text('Ready');
    }
}
function isNotEmpty(n) {
    return n.length > 0;
}
function onCalling() {
    console.log("onCalling");
    $('#status_txt').text('Connecting....');
}
function onMediaPermission (result) {
    if (result) {
        console.log("get media permission");
    } else {
        alert("you don't allow media permission, you will can't make a call until you allow it");
    }
}
function webrtcNotSupportedAlert() {
    $('#txtStatus').text("");
    alert("Your browser doesn't support WebRTC. You need Chrome 25 to use this demo");
}
function onLogin() {
    $('#status_txt').text('Logged in');
    $('#callcontainer').show();
}
function onLoginFailed() {
    $('#status_txt').text("Login Failed");
}
function onCallRemoteRinging() {
    $('#status_txt').text('Ringing..');
}
function onCallAnswered() {
    console.log('onCallAnswered');
    $('#status_txt').text('Call Answered');
}
function onReady() {
    console.log("onReady...");
    login();
}
// Initialization
$(document).ready(function() {
    Plivo.onWebrtcNotSupported = webrtcNotSupportedAlert;
    Plivo.onReady = onReady;
    Plivo.onLogin = onLogin;
    Plivo.onLoginFailed = onLoginFailed;
    Plivo.onCalling = onCalling;
    Plivo.onCallRemoteRinging = onCallRemoteRinging;
    Plivo.onCallAnswered = onCallAnswered;
    Plivo.onMediaPermission = onMediaPermission;
    Plivo.init();
    $('#make_call').click(function() {
      call()
    })
});

},{}]},{},[1]);
