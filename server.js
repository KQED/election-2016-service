var express = require('express'),
    app = express(),
    googleHandler = require('./handlers/googleHandler');

app.get('/', googleHandler.getRows);

var PORT = process.env.PORT || 8000;

var server = app.listen(PORT, function(){

  console.log('Server listening on port ' + PORT);

});
