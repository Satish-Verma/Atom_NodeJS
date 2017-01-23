
var http = require('http');
var fs = require("fs");
var port = (process.env.PORT || process.env.VCAP_APP_PORT || 8888);

http.createServer(function (req, resp) {
	// res.writeHead(200, {'Content-Type': 'text/plain'});
	// res.end('Hello Satish!\n');
	if (req.url === "/html") {
        fs.readFile("AppPages/MyPage.html", function (error, pgResp) {
            if (error) {
                resp.writeHead(404);
                resp.write('Contents you are looking are Not Found');
            } else {
                resp.writeHead(200, { 'Content-Type': 'text/html' });
                resp.write(pgResp);
            }

            resp.end();
        });
    }
		else if(req.url==="/plain"){
			fs.readFile('data/users.json','utf8', function(err, data){
				if(err){
					console.log(err);
					resp.writeHead(200, {'Content-Type': 'text/plain'});
					resp.end(err);
				}
				console.log(data);
				resp.writeHead(200, {'Content-Type': 'text/plain'});
				resp.end("("+data+")");
			});
		}
		else {
        //4.
        resp.writeHead(200, { 'Content-Type': 'text/html' });
        resp.write('<h1>Product Manaager</h1><br /><br />To create product please enter: ' + req.url);
        resp.end();
    }

}).listen(port);

console.log('Server running at http://127.0.0.1:'+port);
