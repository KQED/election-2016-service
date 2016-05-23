var rp = require('request-promise'),
    log = require('../logging/bunyan'),
    processData = require('../utils/processData'),
    models = require('../../models');

module.exports = {
  getJson: function(req, res) {
    var url = process.env.AP_URL + '&officeID=Z&officeID=P&officeID=H&officeID=Y&officeID=S';
    rp(url).then(function(body){
      body = JSON.parse(body);
      var processedData = processData.processAp(body);
      res.send(processedData);
    }).catch(function(err){
      module.exports.getFromDataBase(req, res);
      log.info(err);
    });
  },
  getFromDataBase: function(req, res) {
    models.APresults.findAll({
      order: 'createdAt DESC',
      limit: 25
    }).then(function(results) {
      var data = [];
      results.forEach(function(result) {
        if(result.dataValues.officename === 'President') {
          result.dataValues.datatype = 'presidential';
        } else if(result.dataValues.officename === 'U.S. House' || result.dataValues.officename === 'U.S. Senate') {
          result.dataValues.datatype = 'congressional';
        } else {
          result.dataValues.datatype = 'state';
        }

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
