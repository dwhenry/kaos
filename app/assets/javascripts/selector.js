$(function($){
  var Deselect = function(project, interval_size) {
    var $project = $(project);
    var interval = 0;
    var stories = $project.children('.stories').children('.story');

    function update_positions() {
      height = setPosition(stories, interval, interval_size)
      $project.css({height: height + 'px'})

      interval += 1;
      if(interval <= interval_size)
        setTimeout(update_positions, 10);
      else
        $project.removeClass('selected');
    }

    update_positions()
  };

  var Select = function(project, interval_size) {
    var $project = $(project);
    var interval = interval_size;
    var stories = $project.children('.stories').children('.story');

    function update_positions() {
      height = setPosition(stories, interval, interval_size)
      $project.css({height: height + 'px'})

      interval -= 1;
      if(interval >= 0)
        setTimeout(update_positions, 10);
    }

    $project.addClass('selected');
    update_positions()
  }

  function setPosition(stories, interval, interval_size) {
    $.each(stories, function(i, story) {
      x = i * 230 * (interval_size - interval) / interval_size;
      y = (i * -75) + (i * -37 * (interval_size - interval) / interval_size);
      $(story).css({top: y + 'px', left: x + 'px'});
    });

    scroll = stories.length > 4 ? 20 : 0;
    return 146 + scroll + ((stories.length * 32 - scroll) * interval) / interval_size ;
    // return 146 + (stories.length * 32 * interval / interval_size) + (scroll * (interval_size - interval) / interval_size) ;
  }

  $('#page').on('click', '.project', function() {
    if($(this).hasClass('selected')) {
      $.each($('#page .selected'), function(i, selected) {
        new Deselect(selected, 100);
      })
    } else {
      $.each($('#page .selected'), function(i, selected) {
        new Deselect(selected, 100);
      })
      new Select(this, 100)
    }
    return false;
  });

});
