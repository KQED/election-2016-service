# election-2016-service

##About
A service to collect election results data from AP, CA Secretary of State, and Google Docs. Inspiration for some of this repo was taken from [Elex](https://github.com/newsdev/elex).

##Requirements
- Node.js
- npm
- MySQL

##Configuration
Set the following environment variables:
```
$ export AP_URL='https://api.ap.org/v2/elections/2012-11-06?apiKey=YOUR_AP_API_KEY&format=json&statePostal=CA'
$ export ELECTIONS_DB_HOST='YOUR_MYSQL_HOST'
$ export ELECTIONS_DB_USER='YOUR_MYSQL_USERNAME'
$ export ELECTIONS_DB_PASS='YOUR_MYSQL_PASSWORD'
$ export ELECTIONS_DB_DB='YOUR_MYSQL_DATABASE'
$ export ELECTIONS_DB_PORT='YOUR_MYSQL_PORT'
$ export NODE_ENV='production' | 'development'
$ export CACHE_PREFIX='YOUR_CACHE_PREFIX'
```

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

##Endpoints
### `/ap`
Get election results data from AP API

### `/sos`
Get election results data from CA Secretary of State XML feed

### `/googleDoc`
Get election results data from designated Google Doc




