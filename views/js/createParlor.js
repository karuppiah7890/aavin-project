$(document).ready(function(){
  $('#form').submit(function(e){
    e.preventDefault()
    const parlorName = $('#parlorName').val()
    const data = {
      parlorName: parlorName
    };

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
    console.log('Ajax Success response: ', response);
    if(response.status === 'success') {
      if(response.message === 'exists') {
        alert('Parlor already exists')
      } else {
        alert('Parlor created!')
      }
    } else {
      alert('Some error occurred while creating a parlor')
    }

  }

  function onErrorFunc(err) {
    console.log('Error in ajax call: ', err);
    alert('Some error in sending request to server')
  }

})
