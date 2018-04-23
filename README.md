# URL Shortner Microservice
-----------------------

Microservice that handles shortening url's. Can take in a long url and genrate a short code for it and store it in a db for future use. Or get given a short code and redirect to the original url that the short code was made for.

-----------------------

This is built to be used with glitch and an example of the microservice can be found [Here](https://spring-bubble.glitch.me/)

-----------------------

### Installation

The microservice consists of a single file called server.js.

To setup the microservice the repository can be cloned, and then run

```
npm install
```
This will install the required dependencies for the microservice.

###### Database

MongoDB is the database used to store the URL data for future lookup of the long and short URLs'.

The database URL is stored in a .env file so that it can be private from repo and can be more easily changed between servers.

The URL can is added in the form:
```
MONGOURI="Address of your mongodb"
```

###### Running the Microservice

The microservice can then be run using either of the following commands:

```javascript
PORT=XXXX npm start
```

OR

```javascript
PORT=XXXX node server.js
```

Where __XXXX__ is the port number you want it to run on.

-----------------------

##### Usage

To generate a shortend URL you can use the following path on either your webiste of the one in the given example:

```URL
https://spring-bubble.glitch.me/new/https://www.google.com
```

This tells the microservice to create a short url for ```https://www.google.com```. The microservice will then give back a JSON object with both the original url and short url.
It will also check if the short url already exist in the DB so that duplicates aren't created.

Passing the short code, shown as follows:

```URL
https://spring-bubble.glitch.me/YYYY
```

Where ```YYYY``` is the short code for the original website. This will execute a redirect to the original url that was given, or if the url doesn't exisit in the database will give a warning message saying so.
