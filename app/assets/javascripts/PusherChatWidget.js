/**
 * Creates an instance of a PusherChatWidget, binds to a chat channel on the pusher instance and
 * and creates the UI for the chat widget.
 *
 * @param {Pusher} pusher The Pusher object used for the chat widget.
 * @param {Map} options A hash of key value options for the widget.
 */
function PusherChatWidget(pusher, options) {
  PusherChatWidget.instances.push(this);
  var self = this;

  this._pusher = pusher;
  this._autoScroll = true;

  options = options || {};
  this.settings = $.extend({
    maxItems: 50, // max items to show in the UI. Items beyond this limit will be removed as new ones come in.
    chatEndPoint: 'php/chat.php', // the end point where chat messages should be sanitized and then triggered
    channelName: document.location.href, // the name of the channel the chat will take place on
    appendTo: document.body, // A jQuery selector or object. Defines where the element should be appended to
    debug: true
  }, options);

  if(this.settings.debug && !Pusher.log) {
    Pusher.log = function(msg) {
      if(console && console.log) {
        console.log(msg);
      }
    }
  }

  // remove any unsupported characters from the chat channel name
  // see: http://pusher.com/docs/client_api_guide/client_channels#naming-channels
  this.settings.channelName = PusherChatWidget.getValidChannelName(this.settings.channelName);

  this._chatChannel = this._pusher.subscribe(this.settings.channelName);

  this._chatChannel.bind('chat_message', function(data) {
    self._chatMessageReceived(data);
  })

  this._itemCount = 0;

  this._widget = PusherChatWidget._createHTML(this.settings.appendTo);
  // this._nicknameEl = this._widget.find('input[name=nickname]');
  this._messageInputEl = this._widget.find('textarea');
  this._messagesEl = this._widget.find('ul');

  this._widget.find('button').click(function() {
    self._sendChatButtonClicked();
  })

  var messageEl = this._messagesEl;
  messageEl.scroll(function() {
    var el = messageEl.get(0);
    var scrollableHeight = (el.scrollHeight - messageEl.height());
    self._autoScroll = ( scrollableHeight === messageEl.scrollTop() );
  });

  this._startTimeMonitor();
};
PusherChatWidget.instances = [];

/* @private */
PusherChatWidget.prototype._chatMessageReceived = function(data) {
  var self = this;

  if(this._itemCount === 0) {
    this._messagesEl.html('');
  }

  var messageEl = PusherChatWidget._buildListItem(data);
  messageEl.hide();
  this._messagesEl.append(messageEl);
  messageEl.slideDown(function() {
    if(self._autoScroll) {
      var messageEl = self._messagesEl.get(0);
      var scrollableHeight = (messageEl.scrollHeight - self._messagesEl.height());
      self._messagesEl.scrollTop(messageEl.scrollHeight);
    }
  });

  ++this._itemCount;

  if(this._itemCount > this.settings.maxItems) {
    this._messagesEl.children(':last').slideUp(function() {
      $(this).remove();
    });
  }
};

/* @private */
PusherChatWidget.prototype._sendChatButtonClicked = function() {
  var nickname = $('#username').text();
  var message = $.trim(this._messageInputEl.val());
  if(!message) {
    alert('please supply a chat message');
    return;
  }

  var chatInfo = {
    nickname: nickname,
    text: message
  };
  this._sendChatMessage(chatInfo);
};

/* @private */
PusherChatWidget.prototype._sendChatMessage = function(data) {
  var self = this;

  this._messageInputEl.attr('readonly');
  $.ajax({
    url: this.settings.chatEndPoint,
    type: 'post',
    data: {
      'chat_info': data
    },
    complete: function(xhr, status) {
      Pusher.log('Chat message sent. Result: ' + status + ' : ' + xhr.responseText);
      if(xhr.status === 200) {
        self._messageInputEl.val('');
      }
      self._messageInputEl.removeAttr('readonly');
    }
  })
};

/* @private */
PusherChatWidget.prototype._startTimeMonitor = function() {
  var self = this;

  setInterval(function() {
    self._messagesEl.children('.activity').each(function(i, el) {
      var timeEl = $(el).find('a.timestamp span[data-activity-published]');
      var time = timeEl.attr('data-activity-published');
      var newDesc = PusherChatWidget.timeToDescription(time);
      timeEl.text(newDesc);
    });
  }, 10 * 1000)
};

/* @private */
PusherChatWidget._createHTML = function(appendTo) {
  var html = '' +
  '<div class="pusher-chat-widget">' +
    '<div class="pusher-chat-widget-messages">' +
      '<ul class="activity-stream">' +
      '</ul>' +
    '</div>' +
    '<div class="pusher-chat-widget-input">' +
      '<label for="message">Message</label>' +
      '<button class="pusher-chat-widget-send-btn">Send</button>' +
      '<textarea name="message"></textarea>' +
    '</div>' +
    '<div class="pusher-chat-widget-footer">' +
      '<a href="http://pusher.com">Pusher</a> powered realtime chat' +
    '</div>' +
  '</div>';
  var widget = $(html);
  $(appendTo).append(widget);
  return widget;
};

/* @private */
PusherChatWidget._buildListItem = function(activity) {
  var li = $('<li class="activity"></li>');
  li.attr('data-activity-id', activity.id);
  var item = $('<div class="stream-item-content"></div>');
  li.append(item);

  var content = $('<div class="content"></div>');
  item.append(content);

  var user = $('<div class="activity-row">' +
                '<span class="user-name">' +
                  '<a class="screen-name" title="' + activity.actor.displayName + '">' + activity.actor.displayName + ':</a> ' +
                '</span>' +
                '<span class="text">' + activity.body.replace(/\\('|&quot;)/g, '$1') + '</span>' +
              '</div>');
  content.append(user);

  var time = $('<div class="activity-row">' +
                '<a ' + (activity.link?'href="' + activity.link + '" ':'') + ' class="timestamp">' +
                  '<span title="' + activity.published + '" data-activity-published="' + activity.published + '">' + PusherChatWidget.timeToDescription(activity.published) + '</span>' +
                '</a>' +
                '<span class="activity-actions">' +
                '</span>' +
              '</div>');
  content.append(time);


  return li;
};

/**
 * converts a string into something which can be used as a valid channel name in Pusher.
 * @param {String} from The string to be converted.
 *
 * @see http://pusher.com/docs/client_api_guide/client_channels#naming-channels
 */
PusherChatWidget.getValidChannelName = function(from) {
  var pattern = /(\W)+/g;
  return from.replace(pattern, '-');
}

/**
 * converts a string or date parameter into a 'social media style'
 * time description.
 */
PusherChatWidget.timeToDescription = function(time) {
  if(time instanceof Date === false) {
    time = new Date(Date.parse(time));
  }
  var desc = "dunno";
  var now = new Date();
  var howLongAgo = (now - time);
  var seconds = Math.round(howLongAgo/1000);
  var minutes = Math.round(seconds/60);
  var hours = Math.round(minutes/60);
  if(seconds === 0) {
    desc = "just now";
  }
  else if(minutes < 1) {
    desc = seconds + " second" + (seconds !== 1?"s":"") + " ago";
  }
  else if(minutes < 60) {
    desc = "about " + minutes + " minute" + (minutes !== 1?"s":"") + " ago";
  }
  else if(hours < 24) {
    desc = "about " + hours + " hour"  + (hours !== 1?"s":"") + " ago";
  }
  else {
    desc = time.getDay() + " " + ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"][time.getMonth()]
  }
  return desc;
};