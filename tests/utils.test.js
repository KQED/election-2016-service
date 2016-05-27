var expect = require('chai').expect,
    processData = require('../server/utils/processData');

var apData = {
electionDate: "2012-11-06",
timestamp: "2016-05-27T21:07:50.140Z",
races: [{
  test: false,
  raceID: "5089",
  raceType: "General",
  raceTypeID: "G",
  officeID: "Z",
  officeName: "State Senate",
  description: "Fairfield",
  seatName: "District 3",
  seatNum: "3",
  reportingUnits: [{
    statePostal: "CA",
    stateName: "California",
    level: "state",
    lastUpdated: "2015-11-10T11:14:36Z",
    precinctsReporting: 675,
    precinctsTotal: 675,
    precinctsReportingPct: 100,
    candidates: [{
      first: "Lois",
      last: "Wolk",
      party: "Dem",
      incumbent: true,
      candidateID: "18813",
      polID: "52537",
      ballotOrder: 1,
      polNum: "9048",
      voteCount: 176002,
      winner: "X"},
      { first: "Frank",
      last: "Miranda",
      party: "GOP",
      candidateID: "19232",
      polID: "0",
      ballotOrder: 2,
      polNum: "12113",
      voteCount: 90196}
    ]}]}]};

describe('processData.processAp', function(){

  it('filter out extraneous data from AP', function(){

    var totalVotes = processData.calculateTotalVotes(apData);    
    var processedApData = processData.processAp(apData, totalVotes);

    expect(processedApData[0].officename).to.equal('State Senate');
    expect(processedApData[0].candidateID).to.equal(undefined);
      
  });

});

describe('processData.calculateTotalVotes', function(){

  it('should return a hash table that contains total votes for each race', function(){

    var totalVotes = processData.calculateTotalVotes(apData);      
    expect(totalVotes['9b88b0395c9588bae3cfc0a307197804']).to.equal(266198);
      
  });

});

describe('processData.addDataType', function(){
    
  it('Add counties property to race objects', function(){

    var raceObject = [{officename: 'State Senate', seatname: 'District 3'}];
    processData.addDataType(raceObject, 'counties');
    expect(raceObject[0].counties[0]).to.equal('Contra Costa');  
  
  });

});

describe('processData.isRelevant', function(){
    
  it('filter out unwanted races', function(){
    
    var raceObject = [[{officename: 'State Senate', seatname: 'District 3'}], [{officename: 'State Senate', seatname: 'District 30'}]];
    var filteredObject = raceObject.filter(processData.isRelevant);
    expect(filteredObject.length).to.equal(1);
    expect(filteredObject[0][0].officename).to.equal('State Senate');
  
  });

});
