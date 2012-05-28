class DetailsController < ApplicationController
  layout nil

  def full
    projects = Engine::Project.root
    render :json => {
      :method => 'updateScreen',
      :data => {
        :projects => projects.map(&:name),
        :project_details => projects.each_with_object({}) do |project, res|
          res[project.name] = project.children.map do |project|
            {
              :name => project.name,
              :description => project.description
            }
          end
        end
      },
      :toolbar => render_to_string('toolbar')
    }
  end
end