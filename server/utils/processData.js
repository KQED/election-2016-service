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
    return formattedData;
  }
};
