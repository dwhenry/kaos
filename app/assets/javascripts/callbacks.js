var callbacks = {
  methods: {},

  add: function(name, fct) {
    this.methods[name] = fct
  },

  run: function(name, values) {
    this.methods[name](values)
  }
}


callbacks.add('login', function(data) {
  $('#toolbar').html(data);
  $('#page').html('invalid');
});

callbacks.add('update_screen', function(data) {
  $('#toolbar').html('Toolbar here')
  projects = $("<div class='projects'></div>")

  $.each(data['projects'], function(i, project_name) {
    projects.append(
      build_project(project_name, data['project_details'][project_name])
    );
  })
  $('#page').html(projects);
})

function build_project(name, details) {
  project = $("<div class='project'></div>")
  project.append($("<div class='title'>" + name + "</div>"))
  stories = $("<div class='stories'></div>")

  $.each(details, function(i, item_name) {
    top_px = i * -75;
    stories.append("<div class='story' style='top: " + top_px + "px'>" + item_name + "</div>");
  });
  height = 146 + (details.length * 32);

  project.append(stories)
  project.css({height: height + 'px'})

  return project;
}
