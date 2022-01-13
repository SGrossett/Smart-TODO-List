$(document).ready(function() {
  // $.ajax({
  //   url: `/incomplete`,
  //   method: 'GET',
  //   success: (tasks) => {

  //     console.log(tasks)
  //   },
  //   error: (err) => console.log(`Error: ${err}`)
  // });

  $('input[type="checkbox"]').on('click', function() {
    let id = $(this).attr('id');
    if ($(this).is(':checked')) {
      console.log(id);
      $.ajax({
        url: `/updateToFinished`,
        method: 'POST',
        data: { task_id: id }
      }).then(() => {
        console.log(` ${id} checkbox is checked.`);
        window.location.href = 'http://localhost:8080/incomplete';
      });
    } else if ($(this).is(':not(:checked)')) {
      console.log($(this));
      console.log(`${id} is unchecked`);
    }
  });
});
