module.exports = {
  removeTags: function(string) {
    return string.replace('<br />'," ").replace(/\(.*?\)/g, "").replace('55% BOND', '');
  },

  formatChoicename: function(string) {
    var uppercase = string.toUpperCase();
    return uppercase.replace('BONDS ', '').replace('NP - ', '').replace('VOTES', '').replace('CANDIDATE(S)', '');
  },

  splitByHyphen: function(string) {
    return string.split(/\s*\-\s*/g);
  },

  splitByHyphenSpace: function(string) {
    return string.split(' - ');
  },

  splitByComma: function(string) {
    return string.split(', ');
  }
};
