class LoginsController < ApplicationController
  def logged_in; end

  layout nil

  def new
    @login = Engine::Login.new
  end

  def create
    @login = Engine::Login.new(params[:engine_login])
    if @login.valid?
      session[:user] = @login.user
      redirect_to details_full_path
    else
      required_user
    end
  end

  def show
    if !!session[:user]
      render :text => :logged_in
    else
      render :text => :login_required, :status => 401
    end
  end

  def destroy
    @login = Engine::Login.new
    required_user
  end

  private
  def required_user
    session[:user] = nil
    render :json => {
      :method => 'login',
      :data => render_to_string(:new)
    }
  end
end