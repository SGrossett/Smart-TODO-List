$(document).ready(function() {

  $(`input[type="checkbox"]`).on('click', function(){
    let id = $(this).attr('id');
    if($(this).is(':checked')){
        console.log(id);
        $.ajax({
          url: `/updateToFinished`,
          method: 'POST',
          data: {task_id: id}
        });
        console.log(`${id} checkbox is checked.`);
    }
    else if($(this).is(':not(:checked)')) {
        console.log($(this))
        console.log(`${id} is unchecked`);
    }
  });

  $(`#burger`).on('click', function() {
    $(`.container`).toggle(600);
  });
});
