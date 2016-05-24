var crypto = require('crypto');

module.exports = {
  processAp: function(apData, totalVotes) {
    module.exports.votesStore = {};
    var formattedData = apData.races.map(function(raceObject){
      return raceObject.reportingUnits[0].candidates.map(function(candidate){
        var voteKey = module.exports.hashKey(raceObject.officeName, raceObject.seatName);
        return {
          officename: raceObject.officeName,
          seatname: raceObject.seatName,
          lastupdated: raceObject.reportingUnits[0].lastUpdated,
          precincts: raceObject.reportingUnits[0].precinctsReportingPct,
          firstname: candidate.first,
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
 
  isRelevant: function(formattedObject) {
    if(formattedObject[0].officename === 'U.S. House' && formattedObject[0].seatname === 'District 17') {
      
      module.exports.addDataType(formattedObject, 'datatype', 'congressional');
      return true;
    
    } else if (formattedObject[0].officename === 'U.S. Senate') {
      
      module.exports.addDataType(formattedObject, 'datatype', 'congressional');
      return true;
    
    } else if(formattedObject[0].officename === 'State Senate') {
        if(formattedObject[0].seatname === 'District 3' || formattedObject[0].seatname === 'District 9' || 
          formattedObject[0].seatname === 'District 11' || formattedObject[0].seatname === 'District 15') {
        
          module.exports.addDataType(formattedObject, 'datatype', 'state');
          return true;
        
        }
    } else if(formattedObject[0].officename === 'State Assembly') {
      if(formattedObject[0].seatname === 'District 4' || formattedObject[0].seatname === 'District 14' || 
        formattedObject[0].seatname === 'District 16' || formattedObject[0].seatname === 'District 24' || formattedObject[0].seatname === 'District 27') {
        
        module.exports.addDataType(formattedObject, 'datatype', 'state');
        return true;

      }
    } else if(formattedObject[0].officename === 'President') {
      
      module.exports.addDataType(formattedObject, 'datatype', 'presidential');
      return true;
    
    }
    return false;
  },
    
  addDataType: function(array, key, type) {
    array.forEach(function(item){
      item[key] = type;
    });
  },

  hashKey: function(value1, value2){
    var name = value1 + value2;
    return crypto.createHash('md5').update(name).digest('hex');
  },

  calculateTotalVotes: function(apData) {
    var votesStore = {};
    apData.races.forEach(function(raceObject){
      raceObject.reportingUnits[0].candidates.forEach(function(candidate){
        var key = module.exports.hashKey(raceObject.officeName, raceObject.seatName);
        votesStore[key] = votesStore[key] ? votesStore[key] + candidate.voteCount : candidate.voteCount; 
      });
    });
    return votesStore;
  }

}; 
