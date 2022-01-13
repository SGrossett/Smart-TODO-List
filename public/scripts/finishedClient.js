$(document).ready(function() {
  // const createTaskMarkup = function(taskObj) {
  //   const $task = $(
  //     `<label class="form-control">
  //       <input type="checkbox" class="checkbox incomplete" id="${taskObj.id}" name="${taskObj.category}" value="${taskObj.description.replace(/ /g, '-')}">
  //       ${taskObj.description}
  //     </label>`
  //   );
  //   return $task;
  // }

  // const renderTasks = function(tasks) {
  //   for (let task of tasks) {
  //     const $task = createTaskMarkup(task);
  //     $(`#task-container`).prepend(task)
  //   }
  // }

  // const fetchTasks = function(){
  //   $.ajax({
  //     url: `/completed`,
  //     method: 'GET',
  //     success: (tasks) => {
  //       $('.form-control').empty()
  //       renderTasks(tasks)
  //     },
  //     error: (err) => console.log(`Error: ${err}`)
  //   });
  // };

  // fetchTasks();

  // $.ajax({

  // })

  $.ajax({
    url: `/completed`,
    method: 'GET',
    success: (tasks) => {
      console.log(tasks);
    },
    error: (err) => console.log(`Error: ${err}`)
  });

  $('input[type="checkbox"]').on('click', function() {
    let id = $(this).attr('id');
    if ($(this).is(':checked')) {
      console.log(id);
      console.log(` ${id} checkbox is checked.`);
    } else if ($(this).is(':not(:checked)')) {
      console.log($(this));
      $.ajax({
        url: `/updateToIncomplete`,
        method: 'POST',
        data: { task_id: id }
      }).then(() => {
        window.location.href = 'http://localhost:8080/completed';
        console.log(`${id} is unchecked`);
      });
    }
  });
});
