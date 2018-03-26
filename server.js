// server.js
// where your node app starts

// init project
const express = require('express');
const mongodb = require('mongodb');
const validUrl = require('valid-url');
const shortid = require('shortid');
const app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

const mongoURL = process.env.MONGOURI;
var MongoClient = mongodb.MongoClient;

app.get("/", (request, response) => {
    response.end("URL Shortener Microservice");
});

app.get('/:short', (request, response) => {
  MongoClient.connect(mongoURL, function (err, db) {
    if (err) {
      console.log("Error connecting to the mongodb server");
    } else {
      // var db = client.db('sandboxdeployment');
      var collection = db.collection('tinylinks');
      var shortcode = "https://spring-bubble.glitch.me/" + (request.params.short);
      collection.findOne({"short_url": shortcode }, (err, doc) => {
        if (doc != null) {
          response.redirect(doc.original_url);
        } else {
          response.json({"Error": "Short code DNE in database"})
        }
      });
    }
    db.close();
  })
});

app.get('/new/:original(*)', (request, response) => {
  MongoClient.connect(mongoURL, function (err, db) {
    if (err) {
        console.log("Error connecting to mongodb server")
    } else {
      // var db = client.db('sandboxdeployment');
      var collection = db.collection('tinylinks');
      var givenUrl = request.params.original;
      if (validUrl.isUri(givenUrl)) {
        console.log(givenUrl);
        collection.findOne({"original_url": givenUrl}, {"short_url": 1, "_id": 0}, (err, doc) => {
          if (doc != null) {
            // If there is currently a document in the DB with the orignal url, give back the short code for it.
            response.json({
              "original_url": givenUrl,
              "short_url": doc.short_url
            });
          } else {
            // If the orignal URL doesn't exist in the DB, create it.
            collection.insert([{original_url: givenUrl, short_url: ("https://spring-bubble.glitch.me/" +shortid.generate())}]);
            response.json({
              "original_url": givenUrl,
              "short_url": ("https://spring-bubble.glitch.me/" +shortid.generate())
            });
          }
        })
        // response.end();
      } else {
        response.json({"Error": "Invalid URL"})
      }
    }
    db.close();
  })
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
});
