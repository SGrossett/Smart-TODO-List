function getUserId() {
  let cookieArray = document.cookie.replace(/ /g, '').split(';');
  let userIdParam = cookieArray.find((cookie) => cookie.includes('user_id'));
  const user_id = userIdParam.split('=')[1];
  return user_id;
}

// JQuery - add items to list
$(document).ready(function() {
  console.log('jquery loaded');
  const user_id = getUserId();

  /* ------Adding Items--------------*/
  $('#form1').submit(function(event) {
    event.preventDefault();

    $.ajax({
      url: `/api/tasks`,
      method: 'POST',
      data: $(this).serialize()
    })
      .done((listItems) => {
        $('#task-text').val('');
        fetchTasks();
      })
      .fail((err) => {
        console.log('ERROR', err);
      });
  });

  const createMarkup = function(item, selectorID) {
    return `
    <div>
      <span class="listItem">
        <i class="far fa-square icon" id="completeTask${item.id}"></i>
        ${item.description}
        <a href="http://localhost:8080/edit-task/${item.id}">
        <i class="far fa-edit icon" id="editTask${item.id}"></i>
        </a>
      </span>
      </div>`;
  };
  // <button id="completeTask${selectorID}">X</button>

  const fetchTasks = function() {
    $.ajax({
      url: `/api/tasks/by_user_id/${user_id}`,
      method: 'GET'
    }).done((listItems) => {
      $('.listContents').empty();
      // console.log(listItems);
      listItems.map((item) => {
        const selectorID = `list-item-${item.id}`;
        // add item to movies
        if (item.category === 'movie') {
          $('.movieTasks').prepend(createMarkup(item, selectorID));
        }
        // add item to restaurants
        if (item.category === 'restaurant') {
          $('.restaurantTasks').prepend(createMarkup(item, selectorID));
        }
        // add item to books
        if (item.category === 'book') {
          $('.bookTasks').prepend(createMarkup(item, selectorID));
        }
        // add item to products
        if (item.category === 'product') {
          $('.productTasks').prepend(createMarkup(item, selectorID));
        }
        $(`#completeTask${item.id}`).click(function(event) {
          event.preventDefault();
          console.log('submitting form');
          finishTask(item.id);
        });
      });
    });
  };

  /* ------------Accordion-----------*/
  $('.accordion').accordion({
    collapsible: true,
    // active: false,
    heightStyle: 'content'
  });
  $('.accordion').accordion('refresh');

  /* ------User verification--------*/

  fetchTasks();

  /* --------Removing Items----------*/

  const finishTask = function(id) {
    $.ajax({
      url: `/user-tasks/complete-task`,
      method: 'POST',
      data: { id }
    })
      .done((listItems) => {
        console.log('TASK REMOVED!');
        fetchTasks();
      })
      .fail((err) => {
        console.log('ERROR', err);
      });
  };

  /* -------Edit Profile----------*/
  const editEmail = function(id) {
    $(`#editEmailSubmit`).click(function(event) {
      event.preventDefault();
      console.log('submitting edit');
    });

    $.ajax({
      url: `/edit-user`,
      method: 'POST',
      data: { id }
    })
      .done((listItems) => {
        console.log('EDITED PROFILE!');
        // fetchTasks();
      })
      .fail((err) => {
        console.log('ERROR', err);
      });
  };
});

// REMOVE - this is for the old header
// used in _header partial
function navbarToggle() {
  var x = document.getElementById('menu-links');
  if (x.style.display === 'block') {
    x.style.display = 'none';
  } else {
    x.style.display = 'block';
  }
}
