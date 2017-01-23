var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
var cookieParser = require('cookie-parser');
var pg = require('pg');   // for postgresql


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json()); // for parsing application/json

// app.use(cookieParser());
app.use(cookieParser("secret"));    // passed "secret" for signed key otherwise cookieParser() is enough


var conString = 'postgres://postgres:postgres@localhost:5434/Users' // make sure to match your own database's credentials


var user = {
   "user4" : {
      "name" : "mohit",
      "password" : "password4",
      "profession" : "teacher",
      "id": 4
   }
};
console.log(__dirname);

app.get('/', function (req, res) {
       res.sendFile(__dirname+'/view/index.html');
});

app.get('/users', function (req, res) {
   fs.readFile( "data" + "/" + "users.json", 'utf8', function (err, data) {
       if(err){
         console.log(err);
         res.writeHead(200, {'Content-Type': 'text/plain'});
         res.end(err);
       }
       console.log( data );
       res.end( data );
   });
})

app.post('/users', function (req, res) {
   // First read existing users.
   fs.readFile( "data" + "/" + "users.json", 'utf8', function (err, data) {
       if(err){
         console.log(err);
         res.writeHead(200, {'Content-Type': 'text/plain'});
         res.end(err);
       }
       data = JSON.parse( data );
       data["user4"] = user["user4"];
       console.log( data );
       res.end( JSON.stringify(data));
   });
});

app.get('/users/:id', function (req, res) {
   // First read existing users. access using http://127.0.0.1:8081/2
   fs.readFile( "data" + "/" + "users.json", 'utf8', function (err, data) {
       users = JSON.parse( data );
       var user = users["user" + req.params.id]
       console.log( user );
       res.end( JSON.stringify(user));
   });
});

app.delete('/users', function (req, res) {

   // First read existing users.
   fs.readFile( "data" + "/" + "users.json", 'utf8', function (err, data) {
       data = JSON.parse( data );
       delete data["user" + 2];
       console.log( data );
       res.end( JSON.stringify(data));
   });
});


app.post('/postUserFromReq', function (req, res) {
    const user = req.body;
    const dd1= req.param;
    const dd= (req.params.user5);
    fs.appendFile("data" + "/" +'users.json', JSON.stringify({ name: user.name, age: user.id,profession: user.profession  }), (err) => {
        res.send('successfully registered')
    })
});

app.get('/getCookies', function (req, res) {
       res.cookie('hi', 'hello');
       res.cookie('name', 'tobi');
       res.cookie('rememberme', '1', { expires: new Date(Date.now() + 1000), httpOnly: true });
       res.cookie('cart', { items: [1,2,3] }, { maxAge: 900000 });
       //Default encoding
       res.cookie('some_cross_domain_cookie', 'http://mysubdomain.example.com',{domain:'example.com'});
        // Result: 'some_cross_domain_cookie=http%3A%2F%2Fmysubdomain.example.com; Domain=example.com; Path=/'
        //Custom encoding
        res.cookie('some_cross_domain_cookie', 'http://mysubdomain.example.com',{domain:'example.com', encode: String});
        // Result: 'some_cross_domain_cookie=http://mysubdomain.example.com; Domain=example.com; Path=/;'
       const options = {
        maxAge: 1000 * 60 * 15, // would expire after 15 minutes
        httpOnly: true, // The cookie only accessible by the web server
        signed: true // Indicates if the cookie should be signed
        //this signed require "secret"
      };
       // Set cookie
       res.cookie('cookieName', 'cookieValue', options); // options is optional

       //set json cookie
       const myObj = {name :'myobj',
                    age :25};
       res.cookie('jsoncookie', JSON.stringify(myObj));

       console.log("jsoncookie  ::", JSON.parse(req.cookies.jsoncookie));
       console.log("cookie with name rememberme :: " + req.cookies['rememberme']);
       //or
       console.log("cookie with name hi:: " + req.cookies.hi);
       // Cookies that have not been signed
       console.log('Cookies: ', req.cookies);
       // Cookies that have been signed
       console.log('Signed Cookies: ', req.signedCookies);
       // to clear the cookies.
       //res.clearCookie('hi');
       //console.log('Cookies after clearing hi: ', req.cookies);
       res.end( "Heloooooo!!!!" );
 });


  app.get('/empDownload', function (req, res) {
      res.download('data/users.json', function(err){
        if (err) {
          // Handle error, but keep in mind the response may be partially-sent
          // so check res.headersSent
        } else {
           // decrement a download credit or your variable, etc.
        }
  });
  });



app.get('/emp', function (req, res) {
      pg.connect(conString, function (err, client, done) {
          if (err) {
            return console.error('error fetching client from pool', err)
          }
          client.query('select * from recipes',  function (err, result) {
              done();
              if (err) {
               return console.error('error happened during query', err)
              }
              console.log(result.rows[0]);
              res.end("Query Done");
            //  process.exit(0);
          });
      });
 });

 app.post('/emp', function (req, res) {
       const recipe_data = req.body;
       if(typeof recipe_data==undefined){
         res.end("Empty recipe!!");
       }
       else{
         console.log(recipe_data.name + ' '+recipe_data.ingredients);
         pg.connect(conString, function (err, client, done) {
             if (err) {
               return console.error('error fetching client from pool', err)
             }
             client.query('insert into  recipes values ($1, $2)' ,[recipe_data.name, recipe_data.ingredients] , function (err, result) {
                 done();
                 if (err) {
                  return console.error('error happened during insert query', err)
                 }
                 console.log(result.rows[0]);
                 res.end("Inserted");
             });
         });
       }

  });

var server = app.listen(8085, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port)

});
//var stack = middleware();
console.log("hi");
