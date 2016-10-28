var GoogleSpreadsheet = require('google-spreadsheet'),
    sfgovConfig = require('../utils/sfgovConfig'),
    htmlParser = require('../utils/htmlParser'),
    resultsHelper = require('../utils/resultsHelper'),
    processData = require('../utils/processData');

module.exports = {
  getAlameda: function(req, res) {
    var sheet;
    var doc = new GoogleSpreadsheet(process.env.GOOGLE_DOCS_KEY);
    doc.getInfo(function(err, info){
      sheet = info.worksheets[0];
      sheet.getCells({
        'min-row': 1,
        'max-row': 1,
        'min-col': 2,
        'max-col': 3,
        'return-empty': false
      }, function(err, cells) {
                
        sheet.getRows({
          offset: 1,
          limit: 500,
          orderby: 'col1'
        }, function(err, rows){
          var jsonRows = rows.map(function(row){
            delete row._xml;
            delete row.id;
            delete row._links;
            row.fullname = htmlParser.formatChoicename(row.contestfullname);
            row.precincts = row.processeddone / row.totalprecincts;
            row.votepercent = row.total / row.contesttotal;
            // row.propdescription = sfgovConfig.sfgovDescription[row.contestfullname] ? sfgovConfig.sfgovDescription[row.contestfullname] : '';
            return row;
          //filter to only return rows of desired races
          }).filter(module.exports.filterAlamedaRows);
          var resultsByCategory = resultsHelper.sortByCategory(jsonRows, 'Alameda');
          res.send(resultsByCategory);
        });
      });
    });
  },
  getContraCosta: function(req, res) {
    var sheet;
    var doc = new GoogleSpreadsheet(process.env.GOOGLE_DOCS_KEY);
    doc.getInfo(function(err, info){
      sheet = info.worksheets[1];
      sheet.getCells({
        'min-row': 1,
        'max-row': 1,
        'min-col': 2,
        'max-col': 3,
        'return-empty': false
      }, function(err, cells) {
                
        sheet.getRows({
          offset: 1,
          limit: 400,
          orderby: 'col2'
        }, function(err, rows){
          var totalVotes = processData.calculateGoogleSheetTotalVotes(rows);
          var jsonRows = rows.map(function(row){
            var voteKey = processData.hashKey(row.contestname);
            //remove unwanted google doc metadata
            delete row._xml;
            delete row.id;
            delete row._links;
            row.fullname = htmlParser.formatChoicename(row.choicename);
            row.officename = htmlParser.removeTags(row.contestname);
            var raceName = htmlParser.splitByComma(row.officename);
            row.officename = raceName[0];
            row.seatname = raceName[1] ? raceName[1] : '';
            if (raceName[0].indexOf('Measure') > -1) {
              var formattedRace = htmlParser.splitByHyphen(raceName[0]);
              row.officename = formattedRace[0];
              if(formattedRace[0] === 'Measure O' || formattedRace[0] === 'Measure Y') {
                row.seatname = formattedRace[1] + '-' + formattedRace[2];
              } else {
                row.seatname = formattedRace[1];
              }
            }
            //calculate percentage of votes based on total votes
            row.votecount = parseInt(row.totalvotes);
            row.votepercent = row.votecount / totalVotes[voteKey];
            row.precinctsReportingPct = parseInt(row.numprecincttotal)/parseInt(row.numprecinctrptg);
            row.totalvotes = totalVotes[voteKey];
            return row;
          //filter to only return rows of desired races
          }).filter(module.exports.filterContraCostaRows);
          var resultsByCategory = resultsHelper.sortByCategory(jsonRows, 'ContraCosta');
          res.send(resultsByCategory);
        });
      });
    });
  },
  getMarin: function(req, res) {
    var sheet;
    var doc = new GoogleSpreadsheet(process.env.GOOGLE_DOCS_KEY);
    doc.getInfo(function(err, info){
      sheet = info.worksheets[2];
      sheet.getCells({
        'min-row': 1,
        'max-row': 1,
        'min-col': 2,
        'max-col': 3,
        'return-empty': false
      }, function(err, cells) {
                
        sheet.getRows({
          offset: 1,
          limit: 300,
          orderby: 'col2'
        }, function(err, rows){
          // var totalVotes = processData.calculateGoogleSheetTotalVotes(rows);
          var jsonRows = rows.map(function(row){
            var voteKey = processData.hashKey(row.officename, row.seatname);
            //remove unwanted google doc metadata
            delete row._xml;
            delete row.id;
            delete row._links;
            //calculate percentage of votes based on total votes
            // row.votecount = parseInt(row.votecount);
            // row.votepercent = row.votecount / totalVotes[voteKey];
            // row.totalvotes = totalVotes[voteKey];
            return row;
          });
          var resultsByCategory = resultsHelper.sortByCategory(jsonRows, 'Marin');
          res.send(resultsByCategory);
        });
      });
    });
  },
  getSfRows: function(req, res) {
    var sheet;
    var doc = new GoogleSpreadsheet(process.env.GOOGLE_DOCS_KEY);
    doc.getInfo(function(err, info){
      sheet = info.worksheets[3];
      sheet.getCells({
        'min-row': 1,
        'max-row': 1,
        'min-col': 2,
        'max-col': 3,
        'return-empty': false
      }, function(err, cells) {
                
        sheet.getRows({
          offset: 1,
          limit: 300,
          orderby: 'col1'
        }, function(err, rows){
          var jsonRows = rows.map(function(row){
            delete row._xml;
            delete row.id;
            delete row._links;
            row.precincts = row.processeddone / row.totalprecincts;
            row.votepercent = row.total / row.contesttotal;
            // row.propdescription = sfgovConfig.sfgovDescription[row.contestfullname] ? sfgovConfig.sfgovDescription[row.contestfullname] : '';
            return row;
          //filter to only return rows of desired races
          }).filter(module.exports.filterSFRows);
          var resultsByCategory = resultsHelper.sortByCategory(jsonRows, 'SanFrancisco');
          res.send(resultsByCategory);
        });
      });
    });
  },
  getSantaClara: function(req, res) {
    var sheet;
    var doc = new GoogleSpreadsheet(process.env.GOOGLE_DOCS_KEY);
    doc.getInfo(function(err, info){
      sheet = info.worksheets[5];
      sheet.getCells({
        'min-row': 12,
        'max-row': 1,
        'min-col': 2,
        'max-col': 3,
        'return-empty': false
      }, function(err, cells) {
                
        sheet.getRows({
          offset: 1,
          limit: 375,
          orderby: 'col2'
        }, function(err, rows){
          var totalVotes = processData.calculateGoogleSheetTotalVotes(rows);
          var jsonRows = rows.map(function(row){
            var voteKey = processData.hashKey(row.contestname);
            //remove unwanted google doc metadata
            delete row._xml;
            delete row.id;
            delete row._links;
            row.fullname = htmlParser.formatChoicename(row.choicename);
            row.officename = htmlParser.removeTags(row.contestname);
            var raceName = htmlParser.splitByComma(row.officename);
            row.officename = raceName[0];
            row.seatname = raceName[1] ? raceName[1] : '';
            if (raceName[0].indexOf('Measure') > -1) {
              var formattedRace = htmlParser.splitByHyphen(raceName[0]);
              row.officename = formattedRace[0];
              if(formattedRace[0] === 'Measure O' || formattedRace[0] === 'Measure Y') {
                row.seatname = formattedRace[1] + '-' + formattedRace[2];
              } else {
                row.seatname = formattedRace[1];
              }
            }
            //calculate percentage of votes based on total votes
            row.votecount = parseInt(row.totalvotes);
            row.votepercent = row.votecount / totalVotes[voteKey];
            row.precinctsReportingPct = parseInt(row.numprecincttotal)/parseInt(row.numprecinctrptg);
            row.totalvotes = totalVotes[voteKey];
            return row;
          //filter to only return rows of desired races
          }).filter(module.exports.filterSCRows);
          var resultsByCategory = resultsHelper.sortByCategory(jsonRows, 'SantaClara');
          res.send(resultsByCategory);
        });
      });
    });
  },
  getSolano: function(req, res) {
    var sheet;
    var doc = new GoogleSpreadsheet(process.env.GOOGLE_DOCS_KEY);
    doc.getInfo(function(err, info){
      sheet = info.worksheets[6];
      sheet.getCells({
        'min-row': 1,
        'max-row': 1,
        'min-col': 2,
        'max-col': 3,
        'return-empty': false
      }, function(err, cells) {
                
        sheet.getRows({
          offset: 1,
          limit: 175,
          orderby: 'col2'
        }, function(err, rows){
          var totalVotes = processData.calculateGoogleSheetTotalVotes(rows);
          var jsonRows = rows.map(function(row){
            var voteKey = processData.hashKey(row.officename, row.seatname);
            //remove unwanted google doc metadata
            delete row._xml;
            delete row.id;
            delete row._links;
            //calculate percentage of votes based on total votes
            row.votecount = parseInt(row.votecount);
            row.votepercent = row.votecount / totalVotes[voteKey];
            row.totalvotes = totalVotes[voteKey];
            return row;
          });
          var resultsByCategory = resultsHelper.sortByCategory(jsonRows, 'Solano');
          res.send(resultsByCategory);
        });
      });
    });
  },
  filterAlamedaRows: function(item) {
    if(sfgovConfig.alamedaContestIds.indexOf(item.contestid) > -1) {
      return true;
    }
    return false;
  },
  filterContraCostaRows: function(item) {
    if(sfgovConfig.contraCostaContestIds.indexOf(item.linenumber) > -1) {
      return true;
    }
    return false;
  },
  filterSFRows: function(item) {
    if(sfgovConfig.sfgovContestId.indexOf(item.contestid) > -1) {
      return true;
    }
    return false;
  },
  filterSCRows: function(item) {
    if(sfgovConfig.santaClaraContestIds.indexOf(item.linenumber) > -1) {
      return true;
    }
    return false;
  }
};
