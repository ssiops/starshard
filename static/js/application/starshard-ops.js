!function ($) {
  var update_logs = function () {
    $.ajax({
      url: '/ops/logs',
      method: 'GET',
      dataType: 'json',
      success: function (data) {
        if (data && typeof data.html !== 'undefined') {
          $('.logs-list').html(data.html);
        } else if (typeof data.err !== 'undefined')
          console.log(data.err);
      }
    });
  }

  var update_users = function () {
    $.ajax({
      url: '/ops/users',
      method: 'GET',
      dataType: 'json',
      success: function (data) {
        if (data && typeof data.html !== 'undefined') {
          $('.users-list').html(data.html);
        } else if (typeof data.err !== 'undefined')
          console.log(data.err);
      }
    });
  }

  $(function(){
    update_logs();
    update_users();

    $('.refresh-logs').on('click', function (e) {
      update_logs();
    });

    $('.refresh-users').on('click', function (e) {
      update_users();
    });
  });
}(window.jQuery)
