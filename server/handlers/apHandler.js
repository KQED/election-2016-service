var async = require('async'),
    rp = require('request-promise'),
    log = require('../logging/bunyan'),
    processData = require('../utils/processData');

module.exports = {
  getJson: function(req, res) {
    var url = process.env.AP_URL + '&officeID=Z&officeID=P&officeID=H';
    
    rp(url).then(function(body){
      body = JSON.parse(body);
      var processedData = processData.processAp(body);

      res.send(processedData);
    }).catch(function(err){
      log.info(err);
    });
  }
};
