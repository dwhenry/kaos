$(function() {
  var pusher = new Pusher('9f93d343467a26f15f77');
  var chatWidget;

  var timer = setInterval(function() {
    if($('#username')) {
      clearInterval(timer);
      chatWidget = new PusherChatWidget(pusher, {
        chatEndPoint: 'pusher/chat',
        channelName: 'site-chat',
        appendTo: '#toolbar'
      });
    }
  }, 1000);


});