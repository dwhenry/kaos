class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :logged_in

  def logged_in
    return true if !request.xhr? || session[:user]

    @login = Engine::Login.new
    render :json => {
      :method => 'login',
      :data => render_to_string(:new)
    }
  end
end
