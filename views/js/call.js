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
function logout() {
    $('#status_txt').text('Logged out');
    Plivo.conn.logout();
    $('#callcontainer').hide();
    $('#logout_box').hide();
    $('#login_box').show();
}
function isNotEmpty(n) {
    return n.length > 0;
}
function onCalling() {
    console.log("onCalling");
    $('#status_txt').text('Connecting....');
}
function  onMediaPermission (result) {
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
    $('#logout_box').show();
    $('#callcontainer').show();
    $('#login_box').hide();
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
});
