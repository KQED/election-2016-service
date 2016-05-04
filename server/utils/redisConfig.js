module.exports = {
  cache: {
      development: {
          enabled                 : true,
          cache_expiry_seconds    : 60 * 5,
          redis_host              : 'localhost',
          redis_port              : 6379,
          prefix                  : 'debug' // If not defined, random is used
      },
      production: {
          enabled                 : true,
          cache_expiry_seconds    : 60 * 5,
          redis_host              : 'elasticsearch.uedfzq.0001.usw1.cache.amazonaws.com',
          redis_port              : 6379
      }
  }
};
