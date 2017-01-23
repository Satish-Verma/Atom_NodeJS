var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
//mongoose
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json()); // for parsing application/json

var MongoClient = mongodb.MongoClient;

var conStringForMongoDB = 'mongodb://localhost:27017/testdb' // make sure to match your own database's credentials




app.get('/users', function (req, res) {
  MongoClient.connect(conStringForMongoDB, function (err, db) {
         if (err) {
           console.log('Unable to connect to the mongoDB server. Error:', err);
         } else {
           //HURRAY!! We are connected. :)
           console.log('Connection established to', conStringForMongoDB);

           // Get the documents collection
           var collection = db.collection('testdb');

           // Insert some users
           collection.find({name: 'modulus user'}).toArray(function (err, result) {
             if (err) {
               console.log(err);
             } else if (result.length) {
               console.log('Found:', result);
                res.writeHead(200, {'Content-Type': 'application/json'});
               res.end(JSON.stringify(result));
             } else {
               console.log('No document(s) found with defined "find" criteria!');
             }
             //Close connection
             db.close();
           });
        }
    });
})

app.post('/usersDummy', function (req, res) {
      // taking dummy data and inserting
      MongoClient.connect(conStringForMongoDB, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
            console.log('Connection established to', conStringForMongoDB);
            // do some work here with the database.
            // Get the documents collection
              var collection = db.collection('testdb');

              //Create some users
              var user1 = {name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']};
              var user2 = {name: 'modulus user', age: 22, roles: ['user']};
              var user3 = {name: 'modulus super admin', age: 92, roles: ['super-admin', 'admin', 'moderator', 'user']};

              // Insert some users
              collection.insert([user1, user2, user3], function (err, result) {
                if (err) {
                  console.log(err);
                } else {
                  console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
                }
        //Close connection
            db.close();
        });
     }
   });
});

app.post('/users', function (req, res) {
      // getting data from req and inserting into db.
      const userEntrydata = req.body;
      console.log(userEntrydata);
      if(typeof userEntrydata == undefined){
        res.end("Empty recipe!!");
      }
      else{

            MongoClient.connect(conStringForMongoDB, function (err, db) {
                  if (err) {
                      console.log('Unable to connect to the mongoDB server. Error:', err);
                  } else {
                      //HURRAY!! We are connected. :)
                      console.log('Connection established to', conStringForMongoDB);
                      // do some work here with the database.
                      // Get the documents collection
                        var collection = db.collection('testdb');

                        //Create some users
                        var user1 = userEntrydata;
                        console.log("---"+user1+"---")
                        // Insert some users
                        collection.insert([user1], function (err, result) {
                          if (err) {
                            console.log(err);
                          } else {
                            console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
                          }
                  //Close connection
                  res.send("inserted");
                      db.close();
                  });
           }
         });
     }
});


var server = app.listen(8085, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port)

});
