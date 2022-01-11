// JQuery - add items to list
$(document).ready(function() {
  console.log('jquery loaded');

  $('#form1').submit(function(event) {
    const taskText = $('#task-text').val();
    const markup = `<p class="listItem">${taskText}<button class="deleteButton">X</button></p>`;
    event.preventDefault();
    console.log('submitting form')

    $.ajax({
      url: `/tasks`,
      method: 'POST',
      data: $(this).serialize()
    }).done(listItems => {
      // add filter here
      $('.movieTasks').append(markup);
      console.log('appending the element');
    })
  })
});
// JQuery - accordion list items
$( function() {
  $( "#accordion" ).accordion({
    collapsible: true
  });
  $('#accordion').accordion("refresh")
});


// delete button
// $(".deleteButton").click(function() {
//   $(".movieTasks").eq(1).remove();
// });
// console.log(`delete button being pushed`);
// add filter here
