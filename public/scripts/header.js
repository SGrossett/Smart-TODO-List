$(document).ready(function() {
  console.log('getting email');
  $.get('/api/users/userEmail').then((email) => {
    $('#username').append(email);
  });
});
