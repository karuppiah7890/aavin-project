const Constants = {
  PARLOR_CREATED: 'Parlour Created',
  PARLOR_ALREADY_EXISTS: 'Parlor already exists'
}

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
      if(response.message === Constants.PARLOR_ALREADY_EXISTS) {
        alert(Constants.PARLOR_ALREADY_EXISTS)
      } else if(response.message === Constants.PARLOR_CREATED){
        alert(Constants.PARLOR_CREATED)
      } else {
        console.log('Unknown message')
        alert('Unknown message received from server')
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
