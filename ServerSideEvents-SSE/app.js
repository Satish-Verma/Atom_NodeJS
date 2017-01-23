// define the module we're working with
   var app = angular.module('sse', []);

  app.controller('statCtrl', function($scope){
    $scope.msg = {};
    $scope.msg2 = {};
    // handles the callback from the received event
    var handleCallback = function (msg) {
      console.log("called handleCallback!!")
        $scope.$apply(function () {
            $scope.msg = JSON.parse(msg.data)
        });
    }


    var source = new EventSource('http://127.0.0.1:3000/stats', {withCredentials:false});
    //When the EventSource connection opens, it will fire an open event.
    source.onopen = function(event){
      console.log("sse events opened!");
    }
    //Should something go wrong with our connection, an error will be fired. We can define a handler function for these events using the onerror attribute.
    source.onerror = function(event){
      console.log("some error occured!");
      var txt;
      switch( event.target.readyState ){
          // if reconnecting
          case EventSource.CONNECTING:
              txt = 'Reconnecting...';
              break;
          // if error was fatal
          case EventSource.CLOSED:
              txt = 'Connection failed. Will not retry.';
              break;
      }
      console.log(txt);
    }
    //To handle message events, we can use the onmessage attribute to define a handler function.
    source.addEventListener('message', handleCallback, false);
    //source.addEventListener('sec_message', handleCallback2, false);

  /*  var handleCallback2 = function (msg) {
      console.log("called handleCallback2!!")
        $scope.$apply(function () {
            $scope.msg2 = JSON.parse(msg.data)
        });
        if(msg.id =="CLOSE")
        {
          source.close();
        }
    }*/
    //To close a connection use the close() method.
    // source.close();
  });
