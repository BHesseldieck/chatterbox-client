// YOUR CODE HERE:
//url : https://api.parse.com/1/classes/messages
$( document ).ready(function() {
  window.app = {
    server: 'https://api.parse.com/1/classes/messages',

    init: function() {
      app.fetch(app.server);
    },

    send: function(message) {
      $.ajax({
        url: app.server,
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function(data) {
          app.renderMessage(data);
          console.log(data);
        },
        error: function(errorMessage) {
          console.error('Chatterbox: Message did not send ', errorMessage);
        }
      });
    },

    fetch: function(url, cb) {
      cb = cb || app.renderMessage;

      $.ajax({
        url: url,
        type: 'GET',
        contentType: 'application/json',
        data: {'order': '-createdAt'},
        success: function(data) {
          console.log(data);
          app.clearMessages();
          var messages = data.results;

          messages.forEach(function(elementObj, i, messages) {
            var room = elementObj.roomname;
            if (room !== '' && room !== undefined && !(rooms[room])) {
              rooms[room] = room;
              app.renderRoom(room);
            }

            cb(elementObj);
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
      escapedName = escapedName.replace(/%20/g, ' ');
      var escapedMessage = _.escape(object.text);
      $('#chats').append('<div>@ <span class= "user ' + escapedName + '"> ' + escapedName + '</span>: ' + escapedMessage + '</div></br>');
      if (friends[escapedName]) {
        $('.' + escapedName).addClass('friend');
      }
    },

    renderRoom: function(roomName) {
      var escapedRoom = _.escape(roomName);
      console.log(escapedRoom);
      $('#roomSelect').append('<option value=' + escapedRoom + '>' + escapedRoom + '</option>');
    },
    handleUsernameClick: function(object) {
      var escapedName = _.escape(object.username);
      $('#main').append('<div class = "' + escapedName + '" >' + escapedName + '</div>');
      $('.username').on('click', function() {

      });
    }
  };

  var rooms = {};
  var friends = {};

  app.init();

  $('.submitButton').on('click', function(event) {
    event.preventDefault();
    var userName = window.location.search.split('=')[1];
    app.send({username: userName, text: $('.message').val(), roomname: $('select').val()});
    $('.message').val('');
    console.log('I was pressed');
  });

  $('.createRoom').on('click', function(event) {
    event.preventDefault();
    var roomName = $('.newRoom').val().replace(/ /g, '');
    console.log(roomName);
    rooms[roomName] = roomName;
    app.renderRoom(roomName);
    $('.newRoom').val('');
  });

  $('#chats').on('click', 'span', function() {
    var userName = $(this).attr('class').split(' ')[1].toString();
    if (!friends[userName]) {
      friends[userName] = userName;
    }
  });

  var interval;

  interval = setInterval(function() {
    app.fetch(app.server);
  }, 1000);

  $('select').on('change', function() {
    clearInterval(interval);
    app.clearMessages();
    var room = $('select').val();

    if (room === 'lobby') {
      app.fetch(app.server);
      interval = setInterval(function() {
        app.fetch(app.server);
      }, 1000);
    } else {
      app.fetch(app.server, function(obj) {
        if (obj.roomname === room) {
          app.renderMessage(obj);
        }
      });
      interval = setInterval(function() {
        app.fetch(app.server, function(obj) {
          if (obj.roomname === room) {
            app.renderMessage(obj);
          }
        });
      }, 1000);
    }
  });
});


//list:
// - Implement friend users and bold friend users
// - Design? Make it pretty
// - When you click on a username, get all the messages from that specific user
// - To be continued..
// - fix that just one room exists not depending on Capitalization



































