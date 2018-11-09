// I used ngNotify... however you can replaced if any other messaging used.

/*
<script src="https://cdn.pubnub.com/pubnub-3.7.21.js"></script>
<script src="https://cdn.pubnub.com/sdk/pubnub-angular/pubnub-angular-3.2.1.js"></script>

"jquery": "^2.2.0",
"ng-notify": "^0.7.2"

demo app: Todo: gaurav

*/ 
angular.module('Retails.chatService', [])
.factory('PubnubService', ['$rootScope', '$q', 'Pubnub',
 function PubnubServiceFactory($rootScope, $q, Pubnub) {
  
  // Aliasing this by self so we can access to this trough self in the inner functions
  var self = this;
  this.channels = {};

  // We keep track of the timetoken of the first message of the array
  // so it will be easier to fetch the previous messages later
  
  self.firstMessageTimeToken = null;

  // Function called when channel gets disconnected
  var whenDisconnected = function(){
      ngNotify.set('Connection lost. Trying to reconnect...', {
        type: 'warn',
        sticky: true,
        button: false,
      });
  };

  // Function called when channel gets re-connected
  var whenReconnected = function(){
      ngNotify.set('Connection re-established.', {
          type: 'info',
          duration: 1500
      });
  };

  // Function called when channel is connected successfully
  var whenConnected = function (deferred, self, channel) {

   // console.log(channel);

   /* ngNotify.set('Connection established.', {
          type: 'info',
          duration: 1500
      });*/

    var callbackFunc = function (channelInfo) {
                            return (function(ngEvent,m){
                              channelInfo.messages.push(m)
                              $rootScope.$digest()
                            });
                          }(self.channels[channel]);
        
    subscribeNewMessage(callbackFunc, channel);

    //getMessages(channel);

    deferred.resolve(self.channels)

  };


  // initialization of Pubnub component using pub / sub keys.. channel_names : []
  var init = function(pkey, skey, auth_key, channel_names, username, avatarUrl) {
     
      self.username = username;
      self.avatarUrl = avatarUrl;

      var deferred = $q.defer();

      Pubnub.init({
        subscribe_key: skey,
        publish_key: pkey,
        auth_key: auth_key,
        uuid: username,
        ssl: true
      });

      // subscribing to channel after init to start listening for messgaes
      Pubnub.subscribe({
          channel: channel_names,
          connect: (function (deferred, self) {
            return (function (status) {
              whenConnected(deferred, self, status);
            });
          })(deferred, self),
          disconnect : whenDisconnected, 
          reconnect : whenReconnected,
          callback: function (message, status) {
            //console.log(message);
            var channel = (status && status.length > 1 && status[2]) ? status [2] : null;

            self.channels[channel].messages.push(message);

            $rootScope.$digest();
            // Event emitted.. so that controller can listen to this event and whenever this event recieved scroll to bottom for diaplying the latest message
            $rootScope.$emit('factory:message:populated', self.channels[channel].messages);
          },
          triggerEvents: ['callback', 'errors']
      });


      // closure for passing channel names for time() to initialize each channel
      (function (channel_names) {
        Pubnub.time(function(time){
          self.firstMessageTimeToken = time;
          
          // form all channels related informational objects
          channel_names.forEach(function(channel, index) {
            if (!self.channels[channel]) {
              self.channels[channel] = {
                "name": channel,
                "messages": [],
                "firstMessageTimeToken": time,
                "messagesAllFetched": false,
                "username": username
              }
            }
          });
        })
      })(channel_names);

    return deferred.promise;
  };

  // populate all the messages as recieved and broadcast event so that new message recieved can be understood by controller
  var populate = function(channel){

    var defaultMessagesNumber = 10;

    Pubnub.history({
     channel: channel,
     callback: function(m){
        // Update the timetoken of the first message
        self.channels[channel].timeTokenFirstMessage = m[1]
        angular.extend(self.channels[channel].messages, m[0]);
        
        if(m[0].length < defaultMessagesNumber){
          self.channels[channel].messagesAllFetched = true;
        }

        $rootScope.$digest();
        
        // Event emitted.. so that controller can listen to this event and whenever this event recieved scroll to bottom for diaplying the latest message
       //$rootScope.$emit('factory:message:populated', self.channels[channel].messages);
           
           var object={
            "mesages":self.channels[channel].messages,
            "channel":channel
           }

        $rootScope.$emit('getmessages', object);


     },
     count: defaultMessagesNumber, 
     reverse: false
    });
    

  };

  // send a callback function which will be executed, whenever a new message has arrived
  var subscribeNewMessage = function(callback, channel){
    $rootScope.$on(Pubnub.getMessageEventNameFor(channel), callback);
  };

  // Pubnub History API used for fetching previous messages
  var fetchPreviousMessages = function(channel){

    var defaultMessagesNumber = 10;

    var deferred = $q.defer()

    Pubnub.history({
     channel: channel,
     callback: function(m){
        // Update the timetoken of the first message
        self.channels[channel].timeTokenFirstMessage = m[1]
        Array.prototype.unshift.apply(self.channels[channel].messages,m[0])
        
        if(m[0].length < defaultMessagesNumber){
          self.channels[channel].messagesAllFetched = true;
        }

        $rootScope.$digest()
        deferred.resolve({
          error: false,
          messages: m,
          messageCount: m[0].length,
          channelInfo: self.channels[channel]
        })

     },
     error: function(error){
        deferred.reject(error)
     },
     count: defaultMessagesNumber, 
     start: self.channels[channel].timeTokenFirstMessage,
     reverse: false
    });

    return deferred.promise
  };

  // To fetch all the messages from channel and populate the same in messages[]
  var getMessages = function(channel) {

    //if (self.channels[channel].messages.length === 0)
    
    populate(channel);

  };

  // To check whether all messages have been fetched or not
  var messagesAllFetched = function(channel) {

    return self.channels[channel].messagesAllFetched;

  };

  // To fetch channel related information object
  var fetchChannelInfo = function(channel) {

    return ((self.channels && self.channels.length > 0) ? self.channels[channel] : null);

  };

  // Post messages in chat window
  var sendMessage = function(messageContent, msgCategory, channel) {
    // Don't send an empty message 
    if (!messageContent)
        return;

    Pubnub.publish({
        channel: channel,
        message: {
            uuid: (Date.now() + self.username),
            content: messageContent,
            sender_uuid: self.username,
            date: Date.now(),
            avatarUrl: self.avatarUrl,
            messageCategory: msgCategory // event or chat
        }
    });
  };


  //init();

  // The public API interface
  return {
    init: init,
    getMessages: getMessages, 
    sendMessage: sendMessage,
    subscribeNewMessage: subscribeNewMessage,
    fetchPreviousMessages: fetchPreviousMessages,
    messagesAllFetched : messagesAllFetched,
    fetchChannelInfo: fetchChannelInfo
  } 

}]);