var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var env       = process.env.NODE_ENV || 'development';
var sequelize = new Sequelize(process.env.ELECTIONS_DB_DB, process.env.ELECTIONS_DB_USER, process.env.ELECTIONS_DB_PASS, {
  host: process.env.ELECTIONS_DB_HOST,
  port: process.env.ELECTIONS_DB_PORT,
  dialect: 'mysql',
  define: {
    timestamps: false,
  }
});
var db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
