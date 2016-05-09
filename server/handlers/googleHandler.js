var GoogleSpreadsheet = require('google-spreadsheet');

module.exports = {
  getRows: function(req, res) {
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
          limit: 20,
          orderby: 'col2'
        }, function(err, rows){
          var jsonRows = rows.map(function(row){
            var object = {location: row.location};
            object[cells[0]._value] = row[cells[0]._value];
            object[cells[1]._value] = row[cells[1]._value];
            return object;
          });
          res.send(jsonRows);
        });
      });
    });
  }
};
