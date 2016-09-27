// YOUR CODE HERE:
//url : https://api.parse.com/1/classes/messages
window.app = {
  init: function() {
    app.fetch('https://api.parse.com/1/classes/messages');
  },

  send: function(message) {
    $.ajax({
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data) {
        console.log('Chatterbox: Message sent!');
      },
      error: function(errorMessage) {
        console.error('Chatterbox: Message did not send ', errorMessage);
      }
    });
  },

  fetch: function(url) {
    $.ajax({
      url: url,
      type: 'GET',
      contentType: 'application/json',
      success: function(data) {
        var messages = data.results;
        
        messages.forEach(function(elementObj, i, messages) {
          app.renderMessage(elementObj);
        });

      },
      error: function(errorMessage) {
        console.error('Chatterbox: Not able to receive messages ', errorMessage);
      }
    });
  },

  clearMessages: function() {
    $('#chats').html('');
  },

  renderMessage: function(object) { 
    var escapedName = _.escape(object.username);
    var escapedMessage = _.escape(object.text);
    $('#chats').prepend('<div>' + escapedName + ': ' + escapedMessage + '</div></br>');
  },

  renderRoom: function(object) {
    var escapedRoom = _.escape(object.roomname);
    $('#roomSelect').append('<option value=' + escapedRoom + '>' + escapedRoom + '</option>');
  },
  handleUsernameClick: function(object) {
    var escapedName = _.escape(object.username);
    $('#main').append('<div class = "' + escapedName + '" >' + escapedName + '</div>');
    $('.username').on('click', function() {

    });
  }
};

// $('.submitButton').on('click', function(event) {
//   event.preventDefault();
//   console.log('I was pressed');
// });

app.init();


setInterval(function() {
  app.fetch('https://api.parse.com/1/classes/messages');
}, 10000);










































