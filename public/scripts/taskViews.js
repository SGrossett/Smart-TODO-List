$(document).ready(function() {

  $('.checkbox').on('click', function(){
    let id = $(this).attr('id');

    if ($(this).is(':not(:checked)')) {
      $.ajax({
        url: `/updateToIncomplete`,
        method: 'POST',
        data: { task_id: id }
      }).then(() => {
        $(`#task-${id}`).remove();
      });
    }

    if($(this).is(':checked')){
      $.ajax({
        url: `/updateToFinished`,
        method: 'POST',
        data: {task_id: id}
      }).then(() => {
        $(`#task-${id}`).remove();
      });
  }
  });

  $(`#burger`).on('click', function() {
    $(`.container`).toggle(600);
  });


  $(`i.edit`).on('click', function() {
    let id = $(this).attr('id');
    $(location).attr('href',`http://localhost:8080/edit-task/${id}`);
  });

  $(`i.delete`).on('click', function() {
    let id = $(this).attr('id');

    $.ajax({
      url: `/delete/${id}`,
      method: 'POST',
    }).then(() => {
      $(`#task-${id}`).remove();
      // window.location.href = 'http://localhost:8080/incomplete';
    });
  });
});
