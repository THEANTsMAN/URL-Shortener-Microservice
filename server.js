// URL Shortner Microservice

// Microservice that takes a "normal" URL and create a short URL for it,
// that can then be used to redirect when the short-url is requested.
const express = require('express');
const mongodb = require('mongodb');
const validUrl = require('valid-url');
const shortid = require('shortid');
var dotenv = require('dotenv');

dotenv.load(); // Load the environment variables from the .env

const app = express();

app.use(express.static('public'));

const mongoURL = process.env.MONGOURI;
var MongoClient = mongodb.MongoClient;

app.get("/", (request, response) => {
    response.end("URL Shortener Microservice");
});

// Route for handling getting a short code.
app.get('/:short', (request, response) => {
    MongoClient.connect(mongoURL, function(err, db) {
        if (err) {
            console.log("Error connecting to the mongodb server");
        } else {
            var collection = db.collection('tinylinks');
            // var shortcode = "https://spring-bubble.glitch.me/" + (request.params.short);
            var shortcode = (request.params.short);

            // Lookup the given short url in the DB, and redirect to the normal url if
            // it is found. Otherwise the short url is invalid and DNE in the DB.
            collection.findOne({
                "short_url": shortcode
            }, (err, doc) => {
                if (doc != null) {
                    response.redirect(doc.original_url);
                    db.close();
                } else {
                    response.json({"Error": "Short code DNE in database"})
                    db.close();
                }
            });
        }
    })
});

// Route for handling making a shortcode from a "normal" URL
app.get('/new/:original(*)', (request, response) => {
    MongoClient.connect(mongoURL, function(err, db) {
        if (err) {
            console.log("Error connecting to mongodb server")
        } else {
            var collection = db.collection('tinylinks');
            var givenUrl = request.params.original;
            if (validUrl.isUri(givenUrl)) {
                collection.findOne({
                    "original_url": givenUrl
                }, {
                    "short_url": 1,
                    "_id": 0
                }, (err, doc) => {
                    if (doc != null) {
                        // If there is currently an entry for the orignal url, give back the short code for it.
                        response.json({"original_url": givenUrl, "short_url": doc.short_url});
                        db.close();
                    } else {
                        // If the orignal URL doesn't exist in the DB, create it.
                        var shortUrl = shortid.generate();
                        collection.insert([
                            {
                                original_url: givenUrl,
                                short_url: shortUrl
                            }
                        ]);
                        response.json({"original_url": givenUrl, "short_url": shortUrl});
                        db.close();
                    }
                });
            } else {
                response.json({"Error": "Invalid URL"})
                db.close();
            }
        }
    })
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
    console.log(`Your microservice is listening on port ${listener.address().port}`)
});
