# election-2016-service

##About
A service to collect election results data from AP, the San Francisco city government website and local races. Inspiration for some of this repo was taken from [Elex](https://github.com/newsdev/elex).

##Requirements
- Node.js
- npm
- MySQL
- Redis

##Configuration
Set the following environment variables:
```
$ export AP_URL='https://api.ap.org/v2/elections/2012-11-06?apiKey=YOUR_AP_API_KEY&format=json&statePostal=CA'
$ export GOOGLE_DOCS_KEY='YOUR_GOOGLE_DOCS_KEY'
$ export ELECTIONS_DB_HOST='YOUR_MYSQL_HOST'
$ export ELECTIONS_DB_USER='YOUR_MYSQL_USERNAME'
$ export ELECTIONS_DB_PASS='YOUR_MYSQL_PASSWORD'
$ export ELECTIONS_DB_PORT='YOUR_MYSQL_PORT'
$ export NODE_ENV='production' | 'development'
$ export REDIS_URL='REDIS_URL'
```
Note: This service is programmed to use a database named 'election2016'.

##Installation
```
$ git clone https://github.com/KQED/election-2016-service.git
$ cd election-2016-service
$ npm install
```

##Running the Service Locally
```
$ mysql.server start
$ redis-server
$ node server.js
```

##Testing
```
npm test
```

##Endpoints
### `/ap`
Get race election results data from AP API

### `/approp`
Get prop results data from AP API

### `/apsenatepres`
Get US Senate and Presidential results data from AP API

### `/local`
Get local election results data from designated Google Doc

### `/sfgov`
Get San Francisco election results data from designated Google Doc
