module.exports = {
  cache: {
      development: {
          enabled                 : true,
          cache_expiry_seconds    : 60 * 1,
          redis_host              : 'localhost',
          redis_port              : 6379,
          prefix                  : 'debug' // If not defined, random is used
      },
      production: {
          enabled                 : true,
          cache_expiry_seconds    : 60 * 3,
          redis_host              : process.env.REDIS_URL,
          redis_port              : 6379
      }
  }
};
