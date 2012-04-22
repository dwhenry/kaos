$(function($){
  var Intervals = 100;
  var Running = false;
  var ITEM_WIDTH = 230;
  // $('.projects').offset()['top'] - $('#page').offset()['top']
  var project_offset = 62;

  function run(klass, project, selected) {
    transform = new klass(project, selected);
    transform.run();
  }

  function index(project) {
    return $('.project').index(project);
  }


  var Deselect = function(project, selected) {
    var $project = $(project);

    var positionY = new PositionY(project, 0);
    var positionX = new PositionX(project, 0);

    $project.find('.stories').css({height: 'auto'});

    function trigger_y(check, fct) {
      if(check) setTimeout(move_y, 3)
      else fct()
    }

    function trigger_x(check) {
      if(check) setTimeout(move_x, 6);
      else setTimeout(move_y, 3, selected);
    }

    function move_y() {
      trigger_y(positionY.increment(), function() {
        $project.removeClass('selected');
        if(selected == undefined) Running = false
        else run(Select, selected);
      })
    }

    function move_x() {
      trigger_x(positionX.increment());
    }

    this.run = function() {
      move_x()
    }
  };

  var Select = function(project) {
    var $project = $(project);

    var positionY = new PositionY(project, Intervals);
    var positionX = new PositionX(project, Intervals);

    function trigger_y(check, fct) {
      if(check) setTimeout(move_y, 3)
      else fct()
    }

    function trigger_x(check) {
      if(check) setTimeout(move_x, 6);
      else Running = false;
    }

    function move_y() {
      trigger_y(positionY.decrement(), function() {
        $project.find('.stories').css({height: '146px'});
        setTimeout(move_x, 6);
      })
    }

    function move_x() {
      trigger_x(positionX.decrement());
    }

    this.run = function() {
      $project.addClass('selected');
      move_y()
    }
  }

  var HelperMethods = function() {
    this.eachStory = function (project, fct) {
      stories = $(project).find('.story');
      $.each(stories, fct);
    }

    this.setTop = function(object, top) {
      $(object).css({top: top + 'px'});
    }

    this.setLeft = function(object, left) {
      $(object).css({left: left + 'px'});
    }

    this.setLeftEachProjectAfter = function(project, left) {
      _this = this;
      $.each($('.project'), function(i, p) {
        if(i > index(project))
          _this.setLeft(p, left);
      });
    }

    this.setWidth = function(parent, object, width) {
      if(width <= ($('#page').width() - 20))
        $(parent).find(object).css({width: width + 'px'})
    }

    this.setHeight = function(object, height) {
      $(object).css({height: height + 'px'})
    }

    this.numStories = function(project) {
      return $(project).find('.story').length;
    }
  }

  var PositionAPI = function(interval) {

    this.increment = function() {
      return this.change(interval <= Intervals, 1)
    }

    this.decrement = function() {
      return this.change(interval >= 0, -1)
    }

    this.change = function(check, movement) {
      if(!check)
        return false;
      this.update();
      interval += movement;
      return true;
    }

    this.getInterval = function() {
      return interval;
    }

    this.ratio = function() {
      return (Intervals - this.getInterval()) / Intervals;
    }

  }

  var PositionY = function(project, interval) {
    var UNIT_HEIGHT = 37;
    var ELEMENT_HEIGHT = 75;
    var BOX_HEIGHT = 196

    this.api = PositionAPI
    this.api(interval);

    var hm = new HelperMethods();
    var _this = this;

    function update_position(i, story) {
        hm.setTop(story, -i * (ELEMENT_HEIGHT + UNIT_HEIGHT * _this.ratio()));
        hm.setTop(project, -BOX_HEIGHT * _this.ratio());
        hm.setTop('.projects', project_offset + BOX_HEIGHT * _this.ratio());
      }

    this.update = function() {
      hm.eachStory(project, update_position);
      hm.setHeight(project, BOX_HEIGHT + (1 - _this.ratio()) * hm.numStories(project) * UNIT_HEIGHT);
    }
  }

  var PositionX = function(project, interval) {
    this.api = PositionAPI
    this.api(interval);

    var start_left = index(project) * -ITEM_WIDTH;

    var hm = new HelperMethods();
    var _this = this;

    function update_position(i, story) {
      hm.setLeft(story, i * ITEM_WIDTH * _this.ratio());
      hm.setLeftEachProjectAfter(project, -ITEM_WIDTH * _this.ratio())
    }

    this.update = function() {
      hm.eachStory(project, update_position);

      width = ITEM_WIDTH * (1 + _this.ratio() * hm.numStories(project));
      hm.setWidth(project, '.stories', width);

      hm.setLeft(project, start_left * _this.ratio());
    }
  }


  $('#page').on('click', '.project', function() {
    if(Running) return;

    Running = true;

    if($(this).hasClass('selected'))
      run(Deselect, this);
    else {
      if($('#page .selected').length > 0) {
        _this = this;
        $.each($('#page .selected'), function(i, project) {
          run(Deselect, project, _this);
        })
      } else run(Select, this);
    }
    return false;
  });
});
