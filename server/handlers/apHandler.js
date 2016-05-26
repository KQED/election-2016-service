var rp = require('request-promise'),
    log = require('../logging/bunyan'),
    processData = require('../utils/processData'),
    models = require('../../models');

module.exports = {
  getProp: function(req, res) {
    var url = process.env.AP_URL + '&officeid=I&raceid=8689';
    
    rp(url).then(function(body){
      console.log(body);
      body = JSON.parse(body);
      var totalVotes = processData.calculateTotalVotes(body);

      var processedData = processData.processAp(body, totalVotes);
      res.send(processedData);
    }).catch(function(err){
      module.exports.getFromDataBase(req, res);
      log.info(err);
    });
  },
  getJson: function(req, res) {
    var url = process.env.AP_URL + '&officeID=Z&officeID=P&officeID=H&officeID=Y&officeID=S';
    rp(url).then(function(body){
      body = JSON.parse(body);
      var totalVotes = processData.calculateTotalVotes(body);
      var processedData = processData.processAp(body, totalVotes);
      res.send(processedData);
    }).catch(function(err){
      module.exports.getFromDataBase(req, res);
      log.info(err);
    });
  },
  getFromDataBase: function(req, res) {
    models.APresults.findAll({
      order: 'createdAt DESC'
    }).then(function(results) {
      var data = [];
      var totalVotes = processData.calculateTotalVotes(results);
      results.forEach(function(result) {
        var key = processData.hashKey(result.dataValues.officename, result.dataValues.seatname);
        result.dataValues.votepercent = result.dataValues.votecount / totalVotes[key];
        if(result.dataValues.officename !== 'President' || result.dataValues.officename !== 'U.S. Senate') {
          result.dataValue.counties = sfgovConfig.districtToCounties[result.dataValues.officename][result.dataValues.seatname];
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
