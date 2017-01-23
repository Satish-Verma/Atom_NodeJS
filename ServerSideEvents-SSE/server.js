// most basic dependencies
var express = require('express')
  , http = require('http')
  , os = require('os')
  , path = require('path');

// create the app
var app = express();

// configure everything, just basic setup
app.set('port', process.env.PORT || 3000);
//---------------------------------------
// mini app
//---------------------------------------
var openConnections = [];

app.get('/hello', function(req, res){
  res.end("hello world!");
});

// simple route to register the clients
app.get('/stats', function(req, res) {

    // set timeout as high as possible
    req.socket.setTimeout(50000);

    // send headers for event-stream connection
    // see spec for more information
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': "*",
        'Access-Control-Expose-Headers': '*',
        'Access-Control-Allow-Credentials': true
    });
    res.write('\n');

    // push this res object to our global variable
    openConnections.push(res);

    // When the request is closed, e.g. the browser window
    // is closed. We search through the open connections
    // array and remove this connection.
    req.on("close", function() {
        var toRemove;
        for (var j =0 ; j < openConnections.length ; j++) {
            if (openConnections[j] == res) {
                toRemove =j;
                break;
            }
        }
        openConnections.splice(j,1);
        console.log(openConnections.length);
    });
});

setInterval(function() {
    // we walk through each connection
    openConnections.forEach(function(resp) {
        var d = new Date();
        resp.write('id: ' + d.getMilliseconds() + '\n');
        resp.write('data:' + createMsg() +   '\n\n'); // Note the extra newline
        resp.write('event:'+ 'message'+ '\n');  //optional if only one type of  request SSE is there
        //resp.write('retry:'+'2000'+   '\n\n'); //client retry after 2 sec.

    });

}, 1000);

function createMsg() {
    msg = {};

    msg.hostname = os.hostname();
    msg.type = os.type();
    msg.platform = os.platform();
    msg.arch = os.arch();
    msg.release = os.release();
    msg.uptime = os.uptime();
    msg.loadaverage = os.loadavg();
    msg.totalmem = os.totalmem();
    msg.freemem = os.freemem();

    return JSON.stringify(msg);
}

// startup everything
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
