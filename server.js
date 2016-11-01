var express = require('express'),
    app = express(),
    erc = require('express-redis-cache'),
    uuid = require('node-uuid'),
    cors = require('cors'),
    cors_options = {origin: '*', methods: "GET"},
    environment = process.env.NODE_ENV || 'development',
    // redisConfig = require('./server/utils/redisConfig'),
    // cache_prefix = process.env.CACHE_PREFIX || redisConfig.cache[environment].prefix || uuid.v1().substring(0,6),
    // redis_opts = redisConfig.cache[environment] || {},
    log = require('./server/logging/bunyan'),
    googleHandler = require('./server/handlers/googleHandler'),
    apHandler = require('./server/handlers/apHandler'),
    models = require('./models');

// log.info("cache_prefix:", cache_prefix);


// var cache_opts = {
//     expire  : redis_opts.cache_expiry_seconds,
//     host    : redis_opts.redis_host,
//     port    : redis_opts.redis_port,
//     prefix  : cache_prefix
// };

// var cache = new erc(cache_opts);

// cache.on('message', function(message){
//     log.info("cache", message);
// });

// cache.on('error', function(error){
//     log.error("cache", error);
// });

app.use(cors(cors_options));

//restrict anything other than GET requests
app.post('*', function(req, res) {
    res.status(403).send('Forbidden');
});

app.put('*', function(req, res) {
    res.status(403).send('Forbidden');
});

app.delete('*', function(req, res) {
    res.status(403).send('Forbidden');
});

app.get('/alameda', googleHandler.getAlameda);
app.get('/contraCosta', googleHandler.getContraCosta);
app.get('/marin', googleHandler.getMarin);
app.get('/napa', googleHandler.getNapa);
app.get('/sf', googleHandler.getSfRows);
// app.get('/sanMateo', googleHandler.getSanMateo);
app.get('/santaClara', googleHandler.getSantaClara);
app.get('/solano', googleHandler.getSolano);
// app.get('/sonoma', googleHandler.getSonoma);
app.get('/bart', googleHandler.getBart);



app.get('/ap', apHandler.getOtherRaces);
app.get('/apsenatepres', apHandler.getSenateHouse);
app.get('/approp', apHandler.getProps);

var PORT = process.env.PORT || 8000;

models.sequelize.sync().then(function () {
  var server = app.listen(PORT, function(){

    log.info('Server listening on port ' + PORT);

  });
});
