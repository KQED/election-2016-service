var async = require('async'),
    rp = require('request-promise'),
    log = require('../logging/bunyan'),
    processData = require('../utils/processData');
    models = require('../../models');

module.exports = {
  getJson: function(req, res) {
    var url = process.env.AP_URL + '&officeID=Z&officeID=P&officeID=H&officeID=Y';
    rp(url).then(function(body){
      body = JSON.parse(body);
      var processedData = processData.processAp(body);
      res.send(processedData);
    }).catch(function(err){
      console.log(err);
      module.exports.getFromDataBase(req, res);
      log.info(err);
    });
  },
  getFromDataBase: function(req, res) {
    models.APResults.findAll().then(function(results) {
      var data = [];
      results.forEach(function(result) {
        if(result.dataValues.winner === 'X') {
          result.dataValues.winner = true;
        } else {
          result.dataValues.winner = false;
        }
        data.push(result.dataValues);
      });
      res.send(data);
    });
  }
};
