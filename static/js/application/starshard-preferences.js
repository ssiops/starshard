!function ($) {
  $(function(){
    $('#password_new_confirm').on('blur', function (e) {
      var password = $('#password_new').val();
      if (password != $('#password_new_confirm').val()) {
        $('#password_new_confirm').parents('.form-group').addClass('has-error');
        return;
      }
    });

    $('.password-update').on('click', function (e) {
      var self = $(this);
      var password = $('#password_new').val();
      var password_o = $('#password_old').val();
      if (password.length < 6 || password.length > 20) {
        $('#password_new').parents('.form-group').addClass('has-error');
        $.alert({msg: 'Your password must be 6~20 charaters long.'});
        return;
      }
      if (password != $('#password_new_confirm').val()) {
        $('#password_new_confirm').parents('.form-group').addClass('has-error');
        $.alert({msg: 'Your new passwords don\'t match.'});
        return;
      }
      $.ajax({
        url: '/preferences/password',
        method: 'PUT',
        data: {password: password, password_o: password_o},
        success: function (data) {
          if (data && typeof data.msg !== 'undefined') {
            $.alert({msg: data.msg, style: 'success'});
          } else if (data && typeof data.err !== 'undefined')
            console.log(data.err);
        }
      })
    });

    $('#confirm_removal').on('input', function (e) {
      var email = $(this).val();
      if (email.length > 4 && email.search(/[a-zA-z0-9]+@[a-zA-z0-9]+\.[a-zA-z]+/) >= 0)
        $('.account-delete').removeClass('disabled');
      else
        $('.account-delete').addClass('disabled');
    });

    $('.account-delete').on('click', function (e) {
      e.preventDefault();
      var email = $('#confirm_removal').val();
      $.ajax({
        url: '/preferences/account',
        method: 'DELETE',
        data: {email: email},
        success: function (data) {
          if (data && typeof data.msg !== 'undefined') {
            $.alert({msg: data.msg, style: 'success'});
            setTimeout(function () { window.location.href = '/'; }, 3000);
          } else if (data && typeof data.err !== 'undefined')
            console.log(data.err);
        }
      })
    });
  });
}(window.jQuery)
