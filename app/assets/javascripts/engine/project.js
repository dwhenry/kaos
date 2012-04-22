(function($){
  function buildStroies(details) {
    stories = $("<div class='stories'></div>")

    $.each(details, function(i, item_name) {
      top_px = i * -75;
      stories.append("<div class='story' style='top: " + top_px + "px'>" + item_name + "</div>");
    });

    return stories;
  }

  function buildProject(name, details) {
    project = $("<div class='project'></div>");
    project.append($("<h2>" + name + "</h2>"));

    project.append(buildStroies(details));

    height = 146 + (details.length * 32);
    project.css({height: height + 'px'});

    return project;
  }

  function buttons() {
    div = $("<div class='floating_buttons'></div>)");
    div.append("<a href='/projects/new'>New Project</a>");
    return div;
  }

  Callbacks.add('updateScreen', function(data) {
    header = $("<h1>Projects</h1>");
    projects = $("<div class='projects'></div>")

    $.each(data['projects'], function(i, project_name) {
      projects.append(
        buildProject(project_name, data['project_details'][project_name])
      );
    })


    $('#page').html('');
    $('#page').append(buttons()).append(header).append(projects);
  })

})(jQuery);