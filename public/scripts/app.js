// JQuery
$(document).ready(function() {
  console.log('jquery loaded');
  $('#form1').submit(function(event) {
    const taskText = $('#task-text').val();
    event.preventDefault();
    console.log('submitting form')

    $.ajax({
      url: `/tasks`,
      method: 'POST',
      data: $(this).serialize()
    }).done(tweetArr => {
      $('.container').append(`<div>${taskText}</div>`);
      console.log('appending the element');
    })
  })
})
