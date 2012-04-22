class DetailsController < ApplicationController
  layout nil

  def full
    render :json => {
      :method => 'updateScreen',
      :data => {
        :projects => ['Element A', 'Element B', 'Element C'],
        :project_details => {
          'Element A' => ['Story 1', 'Story 2'],
          'Element B' => ['Story A', 'Story B', 'Story C', 'Story D'],
          'Element C' => ['Story X', 'Story Y', 'Story Z', 'Story W', 'Story V']
        }
      },
      :toolbar => render_to_string('toolbar')
    }
  end
end