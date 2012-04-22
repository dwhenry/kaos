(function($){

  $.fn.loginForm = function(selector) {
    $(this).on('submit', selector, function(xhr, data, status) {
      xhr.preventDefault();
      $.ajax({
        url: '/logins',
        data: $(this).serialize(),
        type: 'POST',
        success: function(value) {
          Callbacks.run(value['method'], value['data'])
          $('#toolbar').html(value['toolbar'])
        }
      })
    });
  };

  $.fn.createLogin = function(selector) {
    $(this).on("click", selector, function(e) {
      e.preventDefault();
    });
  };

  $.fn.logout = function(selector) {
    $(this).on("click", selector, function(e) {
      e.preventDefault();
      $.ajax({
        url: '/logins/1',
        type: 'DELETE',
        success: function(value) {
          Callbacks.run(value['method'], value['data'])
        }
      })
    });
  };

  Callbacks.add('login', function(data) {
    $('#toolbar').html(data);
    $('#page').html('invalid');
  });

})(jQuery);

jQuery(function($){
  $("#toolbar").loginForm("#new_engine_login");
  $("#toolbar").createLogin("#create_login");
  $("#toolbar").logout(".logout");
});
