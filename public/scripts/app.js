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
      console.log('appending the element');
      fetchTasks()
    })
  })

  const createMarkup = function(data){
    return `<div><span class="listItem">${data.description}</span></div>`
  };

  const fetchTasks = function(){
    $.ajax({
      url: `/user-tasks`,
      method: 'GET',
    }).done(listItems => {
      $('.movieTasks').empty()
      listItems.map((item) => {
        // add item to movies
        if (item.category === 'movie') {
          $('.movieTasks').prepend(createMarkup(item));
        }
        // add item to restaurants
        if (item.category === 'restaurant') {
          $('.restaurantTasks').prepend(createMarkup(item));
        }
        // add item to books
        if (item.category === 'book') {
          $('.bookTasks').prepend(createMarkup(item));
        }
        // add item to products
        if (item.category === 'product') {
          $('.productTasks').prepend(createMarkup(item));
        }
      });
    })
  }


  $( ".accordion" ).accordion({
    collapsible: true
  });
  $('.accordion').accordion("refresh")
});
