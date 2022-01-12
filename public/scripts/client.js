const { CommandCompleteMessage } = require("pg-protocol/dist/messages");

$(document).ready(function() {

  const createTaskMarkup = function(taskObj) {
    const $task = $(
      `<label class="form-control">
        <input type="checkbox" class="checkbox incomplete" id="${taskObj.id}" name="${taskObj.category}" value="${taskObj.description.replace(/ /g, '-')}">
        ${taskObj.description}
      </label>`
    );
    return $task;
  }

  const renderTasks = function(tasks) {
    for (let task of tasks) {
      const $task = createTaskMarkup(task);
      $(`#task-container`).prepend(task)
    }
  }

  const fetchTasks = function(){
    $.ajax({
      url: `/completed`,
      method: 'GET',
      success: (tasks) => {
        $('.form-control').empty()
        renderTasks(tasks)
      },
      error: (err) => console.log(`Error: ${err}`)
    });
  };

  fetchTasks();

  $.ajax({
    
  })
});
