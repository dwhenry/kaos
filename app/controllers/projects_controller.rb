class ProjectsController < ApplicationController
  layout nil

  def new
    @project = Engine::Project.new
    render :json => {
      :method => 'display',
      :data => render_to_string('new')
    }
  end

  def create
    @project = Engine::Project.build(params[:engine_project])
    begin
      @project.save!
      redirect_to details_full_path
    rescue Engine::InvalidSave => e
      render :json => {
        :method => 'display',
        :data => render_to_string('new')
      }
    end
  end

  def lookup
    data = Engine::Project.all.map do |project|
      {label: project.name, value: project.id}
    end

    render :json => data
  end
end