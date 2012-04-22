(function($){

  $.fn.getMethod = function(selector) {
    $(this).on('click', selector, function(e) {
      if(e.target.href == '')
        return;
      e.preventDefault();
      $.ajax({
        url: e.target.href,
        success: function(value) {
          Callbacks.run(value['method'], value['data'])
        }
      })
      return false;
    });
  };

  Callbacks.add('display', function(value) {
    $('#page').html(value)
  });

})(jQuery);

$(function($){
  $("body").getMethod("a");
});
