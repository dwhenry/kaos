jQuery(function($){

  function logged_in(success_fct, err_fct) {
    $.ajax({
      url: '/logins/1',
      success: function(data) {
        success_fct()
      },
      error: function(xhr, status) {
        err_fct()
      }
    });
  }

  function setup() {
    $.ajax({
      url: '/details/full',
      success: function(value) {
        callbacks.run(value['method'], value['data'])
        if(value['toolbar'])
          $('#toolbar').html(value['toolbar'])
      }
    })
  }

  function login() {
    $.ajax({
      url: '/logins/new',
      success: function(value) {
        $('#toolbar').html(value)
      }
    })
  }

  logged_in(setup, login)

});