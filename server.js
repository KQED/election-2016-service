var express = require('express'),
    app = express(),
    log = require('./server/logging/bunyan'),
    googleHandler = require('./server/handlers/googleHandler'),
    apHandler = require('./server/handlers/apHandler');

app.get('/googleDoc', googleHandler.getRows);

app.get('/ap', apHandler.getJson);

var PORT = process.env.PORT || 8000;

var server = app.listen(PORT, function(){

  log.info('Server listening on port ' + PORT);

});
