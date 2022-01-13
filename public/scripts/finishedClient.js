$(document).ready(function() {

  $('input[type="checkbox"]').on('click', function(){
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

  $(`#burger`).on('click', function() {
    $(`.container`).toggle(600);
  });
});
