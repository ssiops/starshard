!function ($) {

  $(function(){
    $('#user_login').on('submit', function (e) {
      e.preventDefault();
      var form = {
        username: $('#username').val(),
        password: $('#password').val()
      }
      if (form.username.length < 1) {
        $('#username').parents('.form-group').addClass('has-error');
        return;
      }
      $('.form-group').removeClass('has-error');
      if (form.password.length < 6 || form.password.length > 20) {
        $('#password').parents('.form-group').addClass('has-error');
        return;
      }
      $('.form-group').removeClass('has-error');
      $.ajax({
        url: '/login',
        method: 'POST',
        data: form,
        dataType: 'json',
        statusCode: {
          200: function (data) {
            if (data.err) console.log(data.err);
            if (data.redirect) window.location.href = '/' + data.redirect + '/';
          },
          204: function () {
            window.location.href = '/';
          }
        }
      });

    });
})

}(window.jQuery)
