var rp = require('request-promise'),
    fs = require('fs'),
    unzip = require('unzip'),
    log = require('../logging/bunyan'),
    xml2js = require('xml2js'),
    processData = require('../utils/processData'),
    models = require('../../models');

module.exports = {

  getSOSresults: function(req, res) {
    //download zip file from SOS
    var options = {
      method : "GET",
      uri: 'http://cms.cdn.sos.ca.gov/media/16PP/X16PPv7.zip',
      encoding: null,
      resolveWithFullResponse: true
    };
    rp(options)
      .pipe(fs.createWriteStream('SOSresults.zip'))
      .on('close', function() {
        //unzip results folder
        module.exports.unzipResults(res, res);
        console.log('File written!');
      });
  },

  unzipResults: function(res, res) {
    fs.createReadStream('SOSresults.zip')
      .pipe(unzip.Extract({path: 'SOSresults'}))
      .on('close', function() {
        //convert XML into JSON and send back
        res.send(module.exports.convertXML('SOSresults/X16PP510_0100v7.xml'));
      });
  },

  convertXML: function(file) {
    var xml = fs.readFileSync(file, 'ascii');
    var parser = new xml2js.Parser();
    var convertedResults = {};
    convertedResults.contestName = '';
    convertedResults.issueDate = '';
    convertedResults.reportingUnits = [];

    parser.parseString(xml.substring(0, xml.length), function(err, data) {
      convertedResults.issueDate = JSON.stringify(data["EML"]["EMLHeader"][0]["IssueDate"][0]);
      XMLresults = data["EML"]["Count"][0]["Election"][0]["Contests"][0]["Contest"][0];
      json = JSON.stringify(XMLresults);
      results = JSON.parse(json);
      convertedResults.contestName = results.ContestIdentifier[0].ContestName[0];
      reportingUnitVotes = results.ReportingUnitVotes;
      reportingUnitVotes.forEach(function(reportingUnit) {
        var reportingUnitIdentifier = reportingUnit.ReportingUnitIdentifier[0]._;
        convertedResults.reportingUnits.push(module.exports.createResultObj(reportingUnit));
      });
    });
    return convertedResults;
  },
  createResultObj: function(reportingUnit) {
    var resultObj = {};
    resultObj.reportingUnit = reportingUnit.ReportingUnitIdentifier[0]._;
    resultObj.precintsReporting = reportingUnit.CountMetric[0]._;
    resultObj.totalPrecints = reportingUnit.CountMetric[1]._;
    resultObj.candidates = [];
    reportingUnit.Selection.forEach(function(selection) {
      var candidateObj = {};
      candidateObj.name = selection.Candidate[0].CandidateFullName[0].PersonFullName[0];
      candidateObj.votes = selection.ValidVotes[0];
      candidateObj.percentVotes = selection.CountMetric[0]._;
      candidateObj.party = selection.AffiliationIdentifier[0].RegisteredName[0];
      resultObj.candidates.push(candidateObj);
    });
    return resultObj;
  },
  getBackupFromLoader: function(req, res) {
    models.SOSresults.findAll({
      order: 'createdAt DESC',
      limit: 25
    }).then(function(results) {
      var data = [];
      results.forEach(function(result) {
        data.push(result.dataValues);
      });
      res.send(data);
    });
  }
};