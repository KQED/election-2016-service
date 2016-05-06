var rp = require('request-promise'),
    fs = require('fs'),
    log = require('../logging/bunyan'),
    xml2js = require('xml2js'),
    processData = require('../utils/processData'),
    models = require('../../models');

module.exports = {
  convertXML: function() {
    var xml = fs.readFileSync('server/handlers/X14GG510_0200v7.xml', 'ascii');
    var parser = new xml2js.Parser();
    var convertedResults = {};
    convertedResults.candidates = [];
    convertedResults.validVotes = [];
    convertedResults.party = [];
    convertedResults.issueDate = '';
    convertedResults.precintsReporting = '';
    convertedResults.totalPrecints = '';
    parser.parseString(xml.substring(0, xml.length), function(err, data) {
      convertedResults.issueDate = JSON.stringify(data["EML"]["EMLHeader"][0]["IssueDate"][0]);
      XMLresults = data["EML"]["Count"][0]["Election"][0]["Contests"][0]["Contest"][0];
      json = JSON.stringify(XMLresults);
      results = JSON.parse(json);
      contestName = results.ContestIdentifier[0].ContestName;
      reportingUnitVotes = results.ReportingUnitVotes;
      reportingUnitVotes.forEach(function(reportingUnit) {
        var reportingUnitIdentifier = reportingUnit.ReportingUnitIdentifier[0]._;
        if (reportingUnitIdentifier === 'San Francisco') {
          convertedResults.precintsReporting = reportingUnit.CountMetric[0]._;
          convertedResults.totalPrecints = reportingUnit.CountMetric[1]._;
          reportingUnit.Selection.forEach(function(selection) {
            convertedResults.candidates.push(selection.Candidate[0].CandidateFullName[0].PersonFullName[0]);
            convertedResults.validVotes.push(selection.ValidVotes[0]);
            convertedResults.party.push(selection.AffiliationIdentifier[0].RegisteredName[0]);
          });
        }
      });
    });
    return convertedResults;
    // console.log(convertedResults);
  },
  getDatafromAPI: function(req, res) {
    var url = process.env.AP_URL + '&officeID=Z&officeID=P&officeID=H&officeID=Y';
    rp(url).then(function(body){
      // body = JSON.parse(body);
      // var processedData = processData.processAp(body);
      res.send(module.exports.convertXML());
    }).catch(function(err){
      module.exports.getFromDataBase(req, res);
      log.info(err);
    });
  },
  getFromDataBase: function(req, res) {
    models.APresults.findAll({
      order: 'createdAt DESC',
      limit: 25
    }).then(function(results) {
      var data = [];
      results.forEach(function(result) {
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