var rp = require('request-promise'),
    log = require('../logging/bunyan'),
    processData = require('../utils/processData'),
    models = require('../../models'),
    sfgovConfig = require('../utils/sfgovConfig');

module.exports = {
  //gets prop data from AP API
  getProp: function(req, res) {    
    
    module.exports.pullFromAp(req, res, '&officeid=I&raceid=8689', module.exports.getPropsFromDataBase, null);
  
  },
  getSenatePres: function(req, res) {    
    
    var query = { 
      where: {
          $or: [
            {officename: 'President'},
            {officename: 'U.S. Senate'}
          ]
      }};    
    
    module.exports.pullFromAp(req, res, '&officeID=S&officeID=P', module.exports.getFromDataBase, query);
  
  },
  //gets race data from AP API
  getOtherRaces: function(req, res) {
    
    var query = { 
      where: {
          $and: [
            {officename: {$ne: 'Initiative'}},
            {officename: {$ne: 'President'}},
            {officename: {$ne: 'U.S. Senate'}}
        ]
    }};

    module.exports.pullFromAp(req, res, '&officeID=Z&officeID=H&officeID=Y&officeID=S', module.exports.getFromDataBase, query);
  
  },
  pullFromAp: function(req, res, endpoint, errcallback, query) {
  
    var url = process.env.AP_URL + endpoint;

    rp(url).then(function(body){
      body = JSON.parse(body);
      var totalVotes = processData.calculateTotalVotes(body);
      var processedData = processData.processAp(body, totalVotes);
      res.send(processedData);
    }).catch(function(err){
      //if AP API is throttling us or some other error, pull backup data from DB
      errcallback(req, res, query);
      log.info(err);
    });

  },
  //gets AP race data from DB
  getFromDataBase: function(req, res, query) {

    models.APresults.findAll(query).then(function(results) {

      var data = [];
      var totalVotes = processData.calculateTotalVotes(results);
      results.forEach(function(result) {
        //find key for hash table to get total votecount data
        var key = processData.hashKey(result.dataValues.officename, result.dataValues.seatname);
        result.dataValues.votepercent = result.dataValues.votecount / totalVotes[key];
        
        if(result.dataValues.officename !== 'U.S. Senate' && result.dataValues.officename !== 'President') {
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
  //gets AP prop data from DB
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
