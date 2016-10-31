module.exports = {
  removeTags: function(string) {
    return string.replace('<br />'," ").replace(/\(.*?\)/g, "");
  },

  formatChoicename: function(string) {
    var uppercase = string.toUpperCase();
    return uppercase.replace('BONDS ', '').replace('NP - ', '');
  },

  splitByHyphen: function(string) {
    return string.split(/\s*\-\s*/g);
  },

  splitByComma: function(string) {
    return string.split(', ');
  }
};
