!function ($) {

  $(function(){
    $('.starshard-login').on('click', function (e) {
      var form = {
        username: $('#username').val(),
        password: $('#password').val()
      }
      if (form.username.length < 1) {
        $('#username').parents('.form-group').addClass('has-error');
        return;
      }
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
          200: function (err) {
            alert(err.err);
          },
          204: function () {
            window.location.href = '/';
          }
        }
      });

    });
})

}(window.jQuery)
