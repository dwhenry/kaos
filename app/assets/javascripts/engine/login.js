(function($){

  $.fn.loginForm = function() {

    $('body').on('submit', '.new_engine_login', function(xhr, data, status) {
      xhr.preventDefault();
      $.ajax({
        url: '/logins?' + $(this).serialize(),
        type: 'POST',
        success: function(value) {
          callbacks.run(value['method'], value['data'])
        }
      })
    });
  };

  $.fn.createLogin = function() {
    return $(this).bind("click", function(e) {
      e.preventDefault();
    });
  };

  $.fn.logout = function() {
    return $(this).bind("click", function(e) {
      e.preventDefault();
      $.ajax({
        url: '/logins/1',
        type: 'DESTROY',
        success: function(value) {
          callbacks.run(value['method'], value['data'])
        }
      })
    });
  };

})(jQuery);

// automatically apply to all forms with a class of "prevent-double-submission"
jQuery(function($){
  $("#new_engine_login").loginForm();
  $("#create_login").createLogin();
  $(".logout").logout();
});
