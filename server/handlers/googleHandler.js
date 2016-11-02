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
            var raceName = htmlParser.splitByComma(row.contestfullname);
            row.officename = raceName[0];
            row.seatname = raceName[1] ? raceName[1] : ''; 
            if (raceName[0].indexOf('Measure') > -1) {
              var formattedRace = htmlParser.splitByHyphen(raceName[0]);
              row.officename = formattedRace[0];
              row.seatname = formattedRace[1];
            }
            if(raceName[1] && raceName[0].indexOf('Member ') > -1) {
              row.officename = raceName[1];
              row.seatname = raceName[0];
              if(raceName[2]) {
                row.seatname = raceName[0] + ', ' + raceName[2];
              }
            }
            row.seatname = htmlParser.removeTags(row.seatname);
            row.raceDetails = resultsHelper.checkRaceDetails(row.contestfullname);            
            row.fullname = htmlParser.formatChoicename(row.candidatefullname);
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
          limit: 450,
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
            row.raceDetails = resultsHelper.checkRaceDetails(row.contestname);            
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
            row.precincts = parseInt(row.numprecinctrptg)/parseInt(row.numprecincttotal);
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
          limit: 150,
          orderby: 'col2'
        }, function(err, rows){
          var jsonRows = rows.map(function(row){
            //remove unwanted google doc metadata
            delete row._xml;
            delete row.id;
            delete row._links;
            row.raceDetails = resultsHelper.checkRaceDetails(row.officename);   
            var formattedRace = htmlParser.removeTags(row.officename);
            var raceName = htmlParser.splitByComma(formattedRace);
            row.officename = raceName[0];
            row.seatname = raceName[1] ? raceName[1] : '';
            if(raceName[0].indexOf('Measure') > -1) {
              var formattedMeasure = raceName[0].split(' Measure');
              row.officename = 'Measure ' + formattedMeasure[1];
              row.seatname = formattedMeasure[0];
            }
            row.fullname = htmlParser.formatChoicename(row.candidatename);
            var votepercent = parseInt(row.candidatevotepercentage.replace('%', ''));
            row.votepercent = votepercent/100;
            row.precincts = row.numberofprecinctsreporting.replace('%', '');
            return row;
          //filter to only return rows of desired races
          }).filter(module.exports.filterMarinRows);
          var resultsByCategory = resultsHelper.sortByCategory(jsonRows, null);
          res.send(resultsByCategory);
        });
      });
    });
  },
  getNapa: function(req, res) {
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
          limit: 100,
          orderby: 'col2'
        }, function(err, rows){
          var jsonRows = rows.map(function(row){
            //remove unwanted google doc metadata
            delete row._xml;
            delete row.id;
            delete row._links;
            //calculate percentage of votes based on total votes
            row.votepercent = parseFloat(row.votepct);
            return row;
          });
          var resultsByCategory = resultsHelper.sortByCategory(jsonRows, null);
          res.send(resultsByCategory);
        });
      });
    });
  },
  getSfRows: function(req, res) {
    var sheet;
    var doc = new GoogleSpreadsheet(process.env.GOOGLE_DOCS_KEY);
    doc.getInfo(function(err, info){
      sheet = info.worksheets[4];
      sheet.getCells({
        'min-row': 1,
        'max-row': 1,
        'min-col': 2,
        'max-col': 3,
        'return-empty': false
      }, function(err, cells) {
                
        sheet.getRows({
          offset: 1,
          limit: 200,
          orderby: 'col1'
        }, function(err, rows){
          var jsonRows = rows.map(function(row){
            delete row._xml;
            delete row.id;
            delete row._links;
            var raceName = htmlParser.splitByComma(row.contestfullname);
            if(raceName[0].indexOf('Member') > -1) {
              row.officename = raceName[1];
              row.seatname = raceName[0];
            } else {
              row.officename = raceName[0];
              row.seatname = raceName[1] ? raceName[1] : '';              
            }
            row.fullname = htmlParser.formatChoicename(row.candidatefullname);
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
  getSanMateo: function(req, res) {
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
            row.raceDetails = resultsHelper.checkRaceDetails(row.contestname);
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
            row.precincts = parseInt(row.numprecinctrptg)/parseInt(row.numprecincttotal);
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
  getSantaClara: function(req, res) {
    var sheet;
    var doc = new GoogleSpreadsheet(process.env.GOOGLE_DOCS_KEY);
    doc.getInfo(function(err, info){
      sheet = info.worksheets[6];
      sheet.getCells({
        'min-row': 12,
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
            row.raceDetails = resultsHelper.checkRaceDetails(row.contestname);
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
            row.precincts = parseInt(row.numprecinctrptg)/parseInt(row.numprecincttotal);
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
      sheet = info.worksheets[7];
      sheet.getCells({
        'min-row': 1,
        'max-row': 1,
        'min-col': 2,
        'max-col': 3,
        'return-empty': false
      }, function(err, cells) {
                
        sheet.getRows({
          offset: 1,
          limit: 200,
          orderby: 'col2'
        }, function(err, rows){
          var jsonRows = rows.map(function(row){
            //remove unwanted google doc metadata
            delete row._xml;
            delete row.id;
            delete row._links;
            //calculate percentage of votes based on total votes
            row.votepercent = parseInt(row.votepercent)/100;
            return row;
          });
          var resultsByCategory = resultsHelper.sortByCategory(jsonRows, null);
          res.send(resultsByCategory);
        });
      });
    });
  },
  getSonoma: function(req, res) {
    var sheet;
    var doc = new GoogleSpreadsheet(process.env.GOOGLE_DOCS_KEY);
    doc.getInfo(function(err, info){
      sheet = info.worksheets[8];
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
          var jsonRows = rows.map(function(row){
            //remove unwanted google doc metadata
            delete row._xml;
            delete row.id;
            delete row._links;
            var precinctsPct = parseFloat(row.precinctsreporting)*100;
            row.precincts = precinctsPct.toString();
            row.raceDetails = resultsHelper.checkRaceDetails(row.racetitlecleaner);
            var raceName = htmlParser.splitByHyphenSpace(row.racetitlecleaner);
            row.officename = raceName[0];
            row.seatname = raceName[1];
            row.fullname = htmlParser.formatChoicename(row.candidatename);
            //convert votepercent from string into decimal number
            var votepercent = parseInt(row.votepercentage.replace('%', ''));
            row.votepercent = votepercent/100;
            return row;
          //filter to only return rows of desired races
          }).filter(module.exports.filterSonomaRows);
          var resultsByCategory = resultsHelper.sortByCategory(jsonRows, null);
          res.send(resultsByCategory);
        });
      });
    });
  },
  getBart: function(req, res) {
    var sheet;
    var doc = new GoogleSpreadsheet(process.env.GOOGLE_DOCS_KEY);
    doc.getInfo(function(err, info){
      sheet = info.worksheets[9];
      sheet.getCells({
        'min-row': 1,
        'max-row': 1,
        'min-col': 2,
        'max-col': 3,
        'return-empty': false
      }, function(err, cells) {
                
        sheet.getRows({
          offset: 1,
          limit: 50,
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
          res.send(jsonRows);
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
  filterMarinRows: function(item) {
    if(sfgovConfig.marinContestIds.indexOf(item.raceid) > -1) {
      return true;
    }
    return false;
  },
  filterSFRows: function(item) {
    if(sfgovConfig.sfgovContestIds.indexOf(item.contestid) > -1) {
      return true;
    }
    return false;
  },
  filterSCRows: function(item) {
    if(sfgovConfig.santaClaraContestIds.indexOf(item.linenumber) > -1) {
      return true;
    }
    return false;
  },
  filterSonomaRows: function(item) {
    if(sfgovConfig.sonomaContestIds.indexOf(item.raceid) > -1) {
      return true;
    }
    return false;
  }
};
