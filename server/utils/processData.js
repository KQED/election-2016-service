module.exports = {
  processAp: function(apData) {
    var formattedData = apData.races.map(function(raceObject){
      return raceObject.reportingUnits[0].candidates.map(function(candidate){
        return {
          officeName: raceObject.officeName,
          seatName: raceObject.seatName,
          lastUpdated: raceObject.reportingUnits[0].lastUpdated,
          precinctsReporting: raceObject.reportingUnits[0].precinctsReportingPct,
          candidateFirst: candidate.first,
          candidateLast: candidate.last,
          voteCount: candidate.voteCount,
          winner: candidate.winner ? true : false
        };
      });
    });
    return formattedData.filter(module.exports.isRelevant);
  },
  isRelevant: function(formattedObject) {
    if(formattedObject[0].officeName === 'U.S. House' && formattedObject[0].seatName === 'District 17') {
      return true;
    } else if(formattedObject[0].officeName === 'State Senate') {
        if(formattedObject[0].seatName === 'District 3' || formattedObject[0].seatName === 'District 9' || 
          formattedObject[0].seatName === 'District 11' || formattedObject[0].seatName === 'District 15') {
          return true;
        }
    } else if(formattedObject[0].officeName === 'State Assembly') {
      if(formattedObject[0].seatName === 'District 4' || formattedObject[0].seatName === 'District 14' || 
        formattedObject[0].seatName === 'District 16' || formattedObject[0].seatName === 'District 24' || formattedObject[0].seatName === 'District 27') {
        return true;
      }
    }
    return false;
  }
};
