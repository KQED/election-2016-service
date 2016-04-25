var async = require('async'),
    rp = require('request-promise'),
    log = require('../logging/bunyan'),
    processData = require('../utils/processData');

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

  }
};
