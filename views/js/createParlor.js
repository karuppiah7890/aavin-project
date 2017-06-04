const Constants = {
  PARLOR_CREATED: 'Parlour Created',
  PARLOR_ALREADY_EXISTS: 'Parlor already exists',
  PARLOR_DOESNT_EXIST: `Parlor doesn't exist`,
  USER_ALREADY_EXISTS: 'User already exists',
  USER_CREATED: 'User Created'
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
