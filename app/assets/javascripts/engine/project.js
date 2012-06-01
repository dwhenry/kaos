(function($){

  var _template;
  function template() {
    if(template == undefined) {
      _template = "<div class='story' style='top: {{top_px}}px'> <div> <span class='label'>Name:</span> <span class='value'>{{name}}</span> </div> <div> <span class='label'>Description:</span> <span class='value'>{{description}}</span> </div> </div>"
    }
    return _template;
  }

  function buildStroies(details) {
    stories = $("<div class='stories'></div>")

    $.each(details, function(i, item) {
      top_px = i * -75;
      html = Mustache.to_html(template, {name: item.name, top_ps: top_px, description: item.description});
      stories.append(html);
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