var GoogleSpreadsheet = require('google-spreadsheet'),
    sfgovConfig = require('../utils/sfgovConfig'),
    processData = require('../utils/processData');

module.exports = {
  //get local results
  getLocalRows: function(req, res) {
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
          limit: 200,
          orderby: 'col2'
        }, function(err, rows){
          var totalVotes = processData.calculateTotalVotes(rows);
          var jsonRows = rows.map(function(row){
            var voteKey = processData.hashKey(row.officename, row.seatname);
            //remove unwanted google doc metadata
            delete row._xml;
            delete row.id;
            delete row._links;
            //transform counties string into array
            row.counties = row.counties.split(",");
            //calculate percentage of votes based on total votes
            row.votepercent = row.votecount / totalVotes[voteKey];
            return row;
          });
          res.send(jsonRows);
        });
      });
    });
  },
  //get San Francisco government results (uploaded to google sheet)
  getSfRows: function(req, res) {
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
          orderby: 'col1'
        }, function(err, rows){
          var jsonRows = rows.map(function(row){
            delete row._xml;
            delete row.id;
            delete row._links;
            return row;
          //filter to only return rows of desired races
          }).filter(module.exports.filterRows);
          res.send(jsonRows);
        });
      });
    });
  },
  filterRows: function(item) {
    if(sfgovConfig.sfgovContestId.indexOf(item.contestid) > -1) {
      return true;
    }
    return false;
  }
};
