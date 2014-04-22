!function ($) {
  var update_logs = function () {
    var q = $('.query-logs').val();
    var l = $('.query-logs-limit').val();
    var query = {}
    if (q.length > 0)
      query.q = q;
    if (l.length > 0)
      query.l = l;
    $.ajax({
      url: '/ops/logs',
      method: 'GET',
      data: query,
      dataType: 'json',
      success: function (data) {
        if (data && typeof data.html !== 'undefined') {
          $('.logs-list').html(data.html);
        } else if (data && typeof data.err !== 'undefined')
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
        } else if (data && typeof data.err !== 'undefined')
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

    $('.users-list').on('click', '.set-admin', function (e) {
      e.preventDefault();
      var self = $(this);
      $.ajax({
        url: '/ops/users/admin',
        method: 'PUT',
        data: {name: self.parents('li.dropdown').attr('data-name')},
        success: function (data) {
          if (data && typeof data.msg !== 'undefined') {
            $.alert({msg: data.msg, style: 'success'});
            update_users();
          } else if (data && typeof data.err !== 'undefined')
            console.log(data.err);
        }
      })
    });

    $('.users-list').on('click', '.unset-admin', function (e) {
      e.preventDefault();
      var self = $(this);
      $.ajax({
        url: '/ops/users/admin',
        method: 'DELETE',
        data: {name: self.parents('li.dropdown').attr('data-name')},
        success: function (data) {
          if (data && typeof data.msg !== 'undefined') {
            $.alert({msg: data.msg, style: 'success'});
            update_users();
          } else if (data && typeof data.err !== 'undefined')
            console.log(data.err);
        }
      })
    });

    $('.users-list').on('click', '.remove-user', function (e) {
      e.preventDefault();
      var self = $(this);
      $.ajax({
        url: '/ops/users',
        method: 'DELETE',
        data: {name: self.parents('li.dropdown').attr('data-name')},
        success: function (data) {
          if (data && typeof data.msg !== 'undefined') {
            $.alert({msg: data.msg, style: 'success'});
            update_users();
          } else if (data && typeof data.err !== 'undefined')
            console.log(data.err);
        }
      })
    });
  });
}(window.jQuery)
