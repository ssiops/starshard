!function ($) {

  $(function(){
    $('#user_register').on('submit', function (e) {
      e.preventDefault();
      $('.form-group').removeClass('has-error');
      var form = {
        username: $('#username').val(),
        email: $('#email').val(),
        password: $('#password').val()
      }
      if (form.username.length < 2 || form.username.length > 16 || form.username.search(/^[a-zA-Z0-9\-\_\.]+/) > 0) {
        $('#username').parents('.form-group').addClass('has-error');
        $.alert({msg: 'Your username must be 2~16 characters long with only English letters, numbers, "-", "_" and ".".'});
        return;
      }
      if (form.password.length < 6 || form.password.length > 20) {
        $('#password').parents('.form-group').addClass('has-error');
        $.alert({msg: 'Your password must be 6~20 charaters long.'});
        return;
      }
      if (form.email.length < 1 || form.email.search(/[a-zA-z0-9]+@[a-zA-z0-9]+\.[a-zA-z]+/) < 0) {
        $('#email').parents('.form-group').addClass('has-error');
        $.alert({msg: 'Please enter a valid email address.'});
        return;
      }
      $.ajax({
        url: '/register',
        method: 'PUT',
        data: form,
        dataType: 'json',
        statusCode: {
          200: function (err) {
            $.alert({msg: err.err});
          },
          201: function () {
            window.location.href = '/';
          }
        }
      });

    });
})

}(window.jQuery)
