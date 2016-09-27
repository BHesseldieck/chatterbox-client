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
      var escapedMessage = _.escape(object.text);
      $('#chats').append('<div>' + escapedName + ': ' + escapedMessage + '</div></br>');
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

  app.init();

  $('.submitButton').on('click', function(event) {
    event.preventDefault();
    var userName = window.location.search.split('=')[1];
    app.send({username: userName, text: $('.message').val(), roomname: $('select').val()});
    $('.message').val('');
    console.log('I was pressed');
  });


  $('button').click('.clear', app.clearMessages);

  // var intervalChange = function (intervalFunc, ...args) {
  //   if (intervalFunc === undefined) {
  //     intervalFunc = app.fetch;
  //     args = [app.server];
  //   }
  //   setInterval(function() {
  //     intervalFunc.apply(window, args);
  //   }, 1000);
  // };
  // intervalChange();

  var interval;

  interval = setInterval(function() {
    app.fetch(app.server);
  }, 1000);

  $('select').on('change', function() {
    clearInterval(interval);
    $('#chats').html('');
    var room = $('select').val();
    alert(room);

    if (room === 'lobby') {
      interval = setInterval(function() {
        app.fetch(app.server);
      }, 1000);
    } else {
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





































