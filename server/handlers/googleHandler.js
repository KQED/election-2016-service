var GoogleSpreadsheet = require('google-spreadsheet'),
    sfgovConfig = require('../utils/sfgovConfig');

module.exports = {
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
          var jsonRows = rows.map(function(row){
            delete row._xml;
            delete row.id;
            delete row._links;
            row.counties = row.counties.split(",");
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
