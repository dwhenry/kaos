(function($){

  function buildItem(label, value) {
    item = $("<li></li>");
    item.append($("<span class='label'>" + label + "</span>"));
    item.append($("<span class='value'>" + value + "</span>"));

    return item;
  }

  function buildList(data) {
    list = $('<ul></ul>');
    $.each(data, function(i, status_details) {
      list.append(buildItem('name', status_details['name']));
      item.append(buildItem('description', status_details['description']));
    })
    return list
  }

  function createButton() {
    area = $("<div class='top_menu'><div>")
    area.append("<a href='/statuses/new' class='getMethod'>Create</a>")
    return area
  }

  Callbacks.add('showStatus', function(data) {

    status_container = $("<div class='status'></div>");
    status_container.append(buildList(data));


    $('#page').html('');
    $('#page').append(createButton)
              .append($("<h1>Status'</h1>"))
              .append(status_container);
  })

  $.fn.newStatus = function(selector) {
    $(this).on('submit', selector, function(xhr, data, status) {
      xhr.preventDefault();
      $.ajax({
        url: this.action,
        data: $(this).serialize(),
        type: 'POST',
        success: function(value) {
          Callbacks.run(value['method'], value['data'])
        }
      })
    });
  };

})(jQuery);

jQuery(function($){
  $("#page").newStatus('form');
});



