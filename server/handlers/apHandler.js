var rp = require('request-promise'),
    log = require('../logging/bunyan'),
    processData = require('../utils/processData'),
    models = require('../../models'),
    sfgovConfig = require('../utils/sfgovConfig');

module.exports = {
  getProp: function(req, res) {    
    
    module.exports.pullFromAp(req, res, '&officeid=I&raceid=8689', module.exports.getPropsFromDataBase);
  
  },
  getJson: function(req, res) {
  
    module.exports.pullFromAp(req, res, '&officeID=Z&officeID=P&officeID=H&officeID=Y&officeID=S', module.exports.getFromDataBase);
  
  },
  pullFromAp: function(req, res, endpoint, errcallback) {
  
    var url = process.env.AP_URL + endpoint;

    rp(url).then(function(body){
      body = JSON.parse(body);
      var totalVotes = processData.calculateTotalVotes(body);
      var processedData = processData.processAp(body, totalVotes);
      res.send(processedData);
    }).catch(function(err){
      errcallback(req, res);
      log.info(err);
    });

  },
  getFromDataBase: function(req, res) {
    models.APresults.findAll({
      where: {
        officename: {
          $ne: 'Initiative'
        }
      }
    }).then(function(results) {
      var data = [];
      var totalVotes = processData.calculateTotalVotes(results);
      results.forEach(function(result) {
        var key = processData.hashKey(result.dataValues.officename, result.dataValues.seatname);
        result.dataValues.votepercent = result.dataValues.votecount / totalVotes[key];
        if(result.dataValues.officename !== 'President' && result.dataValues.officename !== 'U.S. Senate') {
          result.dataValues.counties = sfgovConfig.districtToCounties[result.dataValues.officename][result.dataValues.seatname];
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
  },
  getPropsFromDataBase: function(req, res) {
    
    models.APresults.findAll({
      where: {
        officename: 'Initiative'
      }
    }).then(function(results) {
      var data = [];
      var totalVotes = processData.calculateTotalVotes(results);
      results.forEach(function(result) {
        var key = processData.hashKey(result.dataValues.officename, result.dataValues.seatname);
        result.dataValues.votepercent = result.dataValues.votecount / totalVotes[key];
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
