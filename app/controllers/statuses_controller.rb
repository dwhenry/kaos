class StatusesController < ApplicationController
  layout nil

  def index
    @statuses = Engine::Status.all
    render json: {
      method: 'display',
      data: render_to_string('index')
    }
  end

  def new
    @status = Engine::Status.new
    render :json => {
      :method => 'display',
      :data => render_to_string('new')
    }
  end

  def create
    @status = Engine::Status.build(params[:engine_status])
    begin
      @status.save!
      render json: {
        method: 'showStatuses',
        data: Engine::Status.all
      }
    rescue Engine::InvalidSave => e
      render :json => {
        :method => 'display',
        :data => render_to_string('new')
      }
    end
  end
end