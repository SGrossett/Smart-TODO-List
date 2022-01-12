// JQuery - add items to list
$(document).ready(function() {
  console.log('jquery loaded');

  $('#form1').submit(function(event) {
    event.preventDefault();
    console.log('submitting form');

    $.ajax({
      url: `/user-tasks`,
      method: 'POST',
      data: $(this).serialize()
    })
      .done((listItems) => {
        console.log('TASK ADDED!');
        fetchTasks();
      })
      .fail((err) => {
        console.log('ERROR', err);
      });
  });

  const createMarkup = function(data) {
    return `<div><span class="listItem"><button type="submit" id="list-delete">X</button>${data.description}</span></div>`;
  };

  const fetchTasks = function() {
    $.ajax({
      url: `/user-tasks`,
      method: 'GET'
    }).done((listItems) => {
      $('.listContents').empty();
    });
  };

  $('.accordion').accordion({
    collapsible: true,
    active: false
  });
  $('.accordion').accordion('refresh');
});

// used in _header partial
function navbarToggle() {
  var x = document.getElementById("menu-links");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}
