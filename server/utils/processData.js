module.exports = {
  processAp: function(apData) {
    var formattedData = apData.races.map(function(raceObject){
      return raceObject.reportingUnits[0].candidates.map(function(candidate){
        return {
          officename: raceObject.officeName,
          seatname: raceObject.seatName,
          lastupdated: raceObject.reportingUnits[0].lastUpdated,
          precincts: raceObject.reportingUnits[0].precinctsReportingPct,
          firstname: candidate.first,
          lastname: candidate.last,
          votecount: candidate.voteCount,
          winner: candidate.winner ? true : false
        };
      });
    });
    var merged = [].concat.apply([], formattedData.filter(module.exports.isRelevant));
    return merged;
  },
  isRelevant: function(formattedObject) {
    if(formattedObject[0].officename === 'U.S. House' && formattedObject[0].seatname === 'District 17') {
      return true;
    } else if(formattedObject[0].officename === 'State Senate') {
        if(formattedObject[0].seatname === 'District 3' || formattedObject[0].seatname === 'District 9' || 
          formattedObject[0].seatname === 'District 11' || formattedObject[0].seatname === 'District 15') {
          return true;
        }
    } else if(formattedObject[0].officename === 'State Assembly') {
      if(formattedObject[0].seatname === 'District 4' || formattedObject[0].seatname === 'District 14' || 
        formattedObject[0].seatname === 'District 16' || formattedObject[0].seatname === 'District 24' || formattedObject[0].seatname === 'District 27') {
        return true;
      }
    } else if(formattedObject[0].officename === 'President') {
      return true;
    }
    return false;
  }
};
