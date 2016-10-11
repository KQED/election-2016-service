var rp = require('request-promise'),
    log = require('../logging/bunyan'),
    processData = require('../utils/processData'),
    models = require('../../models'),
    sfgovConfig = require('../utils/sfgovConfig');

module.exports = {
  //gets prop data from AP API
  getProps: function(req, res) {    
    
    module.exports.pullFromAp(req, res, '&officeID=I', module.exports.getPropsFromDataBase, null);
  
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
            {officename: {$ne: 'Proposition'}},
            {officename: {$ne: 'Measure'}},
            {officename: {$ne: 'President'}},
            {officename: {$ne: 'U.S. Senate'}}
        ]
    }};

    module.exports.pullFromAp(req, res, '&officeID=Z&officeID=H&officeID=Y&officeID=S', module.exports.getFromDataBase, query);
  
  },
  pullFromAp: function(req, res, endpoint, errcallback, query) {
    console.log('**************************pulling from AP***************************');
  
    var url = process.env.AP_URL + endpoint;
    console.log('url', url);

    rp(url).then(function(body){
      body = JSON.parse(body);
      // console.log('body from AP', body);
      var totalVotes = processData.calculateTotalVotes(body);
      var processedData = processData.processAp(body, totalVotes);
      res.send(processedData);
    }).catch(function(err){
      console.log('*****************getting from DB********************************');
      //if AP API is throttling us or some other error, pull backup data from DB
      errcallback(req, res, query);
      log.info(err);
    });

  },
  //gets AP race data from DB
  getFromDataBase: function(req, res, query) {

    models.APresults.findAll(query).then(function(results) {
      console.log('results from DB', results);

      var data = [];
      var totalVotes = processData.calculateTotalVotes(results);
      results.forEach(function(result) {
        //find key for hash table to get total votecount data
        var key = processData.hashKey(result.dataValues.officename, result.dataValues.seatname);
        result.dataValues.votepercent = result.dataValues.votecount / totalVotes[key];
        result.dataValues.totalvotes = totalVotes[key];
        
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
        officename: 'Proposition'
      }
    }).then(function(results) {
      var data = [];
      var totalVotes = processData.calculateTotalVotes(results);
      results.forEach(function(result) {
        var key = processData.hashKey(result.dataValues.officename, result.dataValues.seatname);
        result.dataValues.votepercent = result.dataValues.votecount / totalVotes[key];
        result.dataValues.totalvotes = totalVotes[key];
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
