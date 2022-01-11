// JQuery - add items to list
$(document).ready(function() {
  console.log('jquery loaded');

  $('#form1').submit(function(event) {
    const taskText = $('#task-text').val();
    const markup = `<div><span class="listItem">${taskText}</span></div>`;
    event.preventDefault();
    console.log('submitting form')

    $.ajax({
      url: `/tasks`,
      method: 'POST',
      data: $(this).serialize()
    }).done(listItems => {
      // add filter here
      // $('.movieTasks').append(markup);
      // const content = $('.movieTasks').html();
      // console.log(content);
      // $('.movieTasks').append(markup);
      console.log('appending the element');
      fetchTasks()
    })
  })

  const createMarkup = function(data){
    return `<div><span class="listItem">${data.description}</span></div>`
  };

  const fetchTasks = function(){
    $.ajax({
      url: `/get-all-tasks`,
      method: 'GET',
    }).done(listItems => {
      $('.movieTasks').empty()
      listItems.map((item) => {
        $('.movieTasks').append(createMarkup(item));
        console.log(item)
      });
    })
  }


  $( ".accordion" ).accordion({
    collapsible: true
  });
  $('.accordion').accordion("refresh")
});
