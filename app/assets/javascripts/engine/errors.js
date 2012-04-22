(function($){


  function itemDetails(label, value) {
    item = $("<li></li>");
    if(label != null)
      item.append($("<span class='label'>" + label + "</span>"));
    item.append($("<span class='value'>" + value + "</span>"));

    return item;
  }

  function errorDetails(xhr, url) {
    list = $('<ul></ul>');

    if(xhr.status == 401) {
      list.append(itemDetails(null, 'Permission Denied'));
    } else {
      list.append(itemDetails('Code', xhr.status));
      list.append(itemDetails('Text', xhr.statusText));
    }
    list.append(itemDetails('URL', url));

    return list
  }


  $(function($){
    $("#page").ajaxError(function(e, xhr, settings, exception) {
      error_container = $("<div class='error'></div>");
      error_container.append(errorDetails(xhr, settings.url));

      $(this).html('');
      $(this).append($("<h1>Error Detected</h1>"))
             .append(error_container);
    });
  });



})(jQuery);

