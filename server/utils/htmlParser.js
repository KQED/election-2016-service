module.exports = {
  removeTags: function(string) {
    return string.replace('<br />'," ").replace(/\(.*?\)/g, "");
  },

  formatChoicename: function(string) {
    return string.replace('BONDS ', '');
  },

  splitByHyphen: function(string) {
    return string.split(/\s*\-\s*/g);
  },

  splitByComma: function(string) {
    return string.split(', ');
  }
};
