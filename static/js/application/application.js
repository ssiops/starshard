!function ($) {

  $.alert = function(opt) {
    var self = $('.float-msg');
    var alert_class = 'alert alert-danger';
    var msg = 'An error has occurred.';
    if (typeof opt === 'string'){
      if (opt === 'show')
        return self.addClass('active');
      if (opt === 'hide')
        return self.removeClass('active');
    }
    else if (typeof opt.msg === 'undefined')
      return self;
    if (typeof opt.style === 'undefined')
      alert_style = 'alert alert-danger';
    else
      alert_style = 'alert alert-' + opt.style;
    msg = opt.msg;
    self.html('<div class="' + alert_style + '"><p>' + msg + ' <a href="#" class="float-msg-dismiss">Dismiss</a></p></div>');
    $.alert('show');
    return self;
  }

  $(function(){
    $('.float-msg').on('click', '.float-msg-dismiss', function (e) {
      $.alert('hide');
    });
  });
}(window.jQuery)
