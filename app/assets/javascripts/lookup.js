(function($){
  $.fn.lookup = function() {
    $(this).autocomplete({
      source: function( request, response ) {
        url = this.element.data('url');
        id_field = this.element.data('field');
        display_field = this.element[0].id;

        $.ajax({
          url: url,
          data: request.term,
          success: function(data) {
            response($.map( data, function( item ) {
              return {
                label: item.label,
                value: item.value,
                id_field: id_field,
                display_field: display_field
              }
            }));
          }
        })
      },

      minLength: 0,

      focus: function(e, ui) {
        return false;
      },

      select: function(e, ui) {
        $('#' + ui.item.id_field).val(ui.item.value);
        $('#' + ui.item.display_field).val(ui.item.label);

        return false;
      },

      change: function(e, ui) {
        if(!ui.item) {
          field = $(e.srcElement).data('field');
          if($(e.srcElement).data('allow_blank'))
            return;
          $('#' + field).val('')
        }
      }
    }).each(function () {
      $(this).data("autocomplete")._renderItem = function( ul, item ) {
        var re = new RegExp(this.term, "gi") ;
        var t = item.label.replace(re,
                "<span style='font-weight:bold; color:Blue;'>$&</span>");
        return $("<li></li>")
               .data("item.autocomplete", item)
               .append("<a>" + t + "</a>")
               .appendTo(ul);
      }
    })
  }
})(jQuery);

$(function($){
  $(".lookup").lookup()
});

