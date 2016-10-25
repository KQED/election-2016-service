var GoogleSpreadsheet = require('google-spreadsheet'),
    sfgovConfig = require('../utils/sfgovConfig'),
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
            row.precincts = row.processeddone / row.totalprecincts;
            row.votepercent = row.total / row.contesttotal;
            // row.propdescription = sfgovConfig.sfgovDescription[row.contestfullname] ? sfgovConfig.sfgovDescription[row.contestfullname] : '';
            return row;
          //filter to only return rows of desired races
          }).filter(module.exports.filterAlamedaRows);
          res.send(jsonRows);
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
          res.send(jsonRows);
        });
      });
    });
  },
  //get local results
  getLocalRows: function(req, res) {
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
          var totalVotes = processData.calculateGoogleSheetTotalVotes(rows);
          var jsonRows = rows.map(function(row){
            var voteKey = processData.hashKey(row.officename, row.seatname);
            //remove unwanted google doc metadata
            delete row._xml;
            delete row.id;
            delete row._links;
            //transform counties string into array
            row.counties = row.counties !== '' ? row.counties.split(",") : '';
            // row.counties = row.counties.split(",");
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
          res.send(jsonRows);
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
            //calculate percentage of votes based on total votes
            row.votecount = parseInt(row.totalvotes);
            row.votepercent = row.votecount / totalVotes[voteKey];
            row.precinctsReportingPct = parseInt(row.numprecincttotal)/parseInt(row.numprecinctrptg);
            row.totalvotes = totalVotes[voteKey];
            return row;
          });
          res.send(jsonRows);
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
  filterSFRows: function(item) {
    if(sfgovConfig.sfgovContestId.indexOf(item.contestid) > -1) {
      return true;
    }
    return false;
  }
};
