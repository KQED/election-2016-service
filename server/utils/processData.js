var crypto = require('crypto'),
    sfgovConfig = require('./sfgovConfig');

module.exports = {
  //filter out extraneous data from AP
  processAp: function(apData, totalVotes) {
    var formattedData = apData.races.map(function(raceObject){
      return raceObject.reportingUnits[0].candidates.map(function(candidate){
        var voteKey = module.exports.hashKey(raceObject.officeName, raceObject.seatName);
        return {
          officename: raceObject.officeName,
          seatname: raceObject.seatName,
          lastupdated: raceObject.reportingUnits[0].lastUpdated,
          precincts: raceObject.reportingUnits[0].precinctsReportingPct,
          firstname: candidate.first || null,
          lastname: candidate.last,
          party: candidate.party,
          votecount: candidate.voteCount,
          votepercent: candidate.voteCount / totalVotes[voteKey],
          winner: candidate.winner ? true : false
        };
      });
    });
    var merged = [].concat.apply([], formattedData.filter(module.exports.isRelevant));
    return merged;
  },
  //only return relevant races
  isRelevant: function(formattedObject) {
    if (formattedObject[0].officename === 'President' || formattedObject[0].officename === 'U.S. Senate' || formattedObject[0].officename === 'Initiative') {
      return true; 
    } else if(formattedObject[0].seatname && sfgovConfig.raceFilter[formattedObject[0].officename].indexOf(formattedObject[0].seatname) > -1) {
      module.exports.addDataType(formattedObject, 'counties');     
      return true;
    }
    return false;
  },
  //used to add counties property to race objects  
  addDataType: function(array, key) {
    array.forEach(function(item){
      item[key] = sfgovConfig.districtToCounties[item.officename][item.seatname];
    });
  },
  //used to create hash table for total vote count per race
  hashKey: function(value1, value2){
    var name = value1 + value2;
    return crypto.createHash('md5').update(name).digest('hex');
  },
  //calculate total results
  calculateTotalVotes: function(apData) {
    var votesStore = {};
    //check to see if data coming from AP
    if(apData.races) {
      apData.races.forEach(function(raceObject){
        raceObject.reportingUnits[0].candidates.forEach(function(candidate){
          var key = module.exports.hashKey(raceObject.officeName, raceObject.seatName);
          votesStore[key] = votesStore[key] ? votesStore[key] + candidate.voteCount : candidate.voteCount; 
        });
      });
    //check to see if data coming from google doc      
    } else if(apData[0].propdescription) {
      apData.forEach(function(race) {
        var key = module.exports.hashKey(race.officename, race.seatname);
        votesStore[key] = votesStore[key] ? votesStore[key] + parseInt(race.votecount) : parseInt(race.votecount); 
      });
    //otherwise, it is data from database      
    } else {
      apData.forEach(function(result) {
        var key = module.exports.hashKey(result.dataValues.officename, result.dataValues.seatname);
        votesStore[key] = votesStore[key] ? votesStore[key] + result.dataValues.votecount : result.dataValues.votecount; 
      });
    }
    return votesStore;
  }

}; 
