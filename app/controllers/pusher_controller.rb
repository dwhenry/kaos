
class PusherController < ApplicationController
  def chat
    chat_info = params[:chat_info]

    channel_name = 'site-chat'

    data = {
      'id' => 12,
      'body' => chat_info['text'],
      'published' => Time.now.to_s,
      'type' => 'chat-message',
      'actor' => {
        'displayName' => chat_info['nickname'],
        'objectType' => 'person',
        'image' => ''
      }
    }

    response = Pusher[channel_name].trigger('chat_message', data)
    render :json => {'activity' => data, 'pusherResponse' => response}
  end

end