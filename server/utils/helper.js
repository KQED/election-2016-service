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
  },

  createContestIdsArray: function(range1, range2, range3, range4) {
    var contestIds = [];
    for(var i = range1; i < range2; i++) {
      contestIds.push(i.toString());
    }
    for(var i = range3; i < range4; i++) {
      contestIds.push(i.toString());
    }
    return contestIds;
  },

  sortByCategory: function(results, selectedCounty) {
    var resultsByCounty = {};
    var resultsByCategory = {};
    resultsByCategory.measures = {};
    resultsByCategory.other = {};

    if(selectedCounty === 'Alameda') {
      resultsByCategory.Oakland = {};
      resultsByCategory.Berkeley = {};
      results.forEach(function(result) {
        if(result.contestfullname.indexOf('Measure') > -1) {
          if(resultsByCategory.measures[result.contestfullname]) {
            resultsByCategory.measures[result.contestfullname].push(result);
          } else {
            resultsByCategory.measures[result.contestfullname] = [result];
          }
        } else if(result.contestfullname.indexOf('Oakland') > -1) {
          if(resultsByCategory.Oakland[result.contestfullname]) {
            resultsByCategory.Oakland[result.contestfullname].push(result);
          } else {
            resultsByCategory.Oakland[result.contestfullname] = [result];
          }
        } else if(result.contestfullname.indexOf('Berkeley') > -1) {
          if(resultsByCategory.Berkeley[result.contestfullname]) {
            resultsByCategory.Berkeley[result.contestfullname].push(result);
          } else {
            resultsByCategory.Berkeley[result.contestfullname] = [result];
          }
        } else {
          if(resultsByCategory.other[result.contestfullname]) {
           resultsByCategory.other[result.contestfullname].push(result);
          } else {
           resultsByCategory.other[result.contestfullname] = [result];
          }
        }
      });
    } else if(selectedCounty === 'SanFrancisco') {
      results.forEach(function(result) {
        if(result.contestfullname.indexOf('Measure') > -1) {
          if(resultsByCategory.measures[result.contestfullname]) {
            resultsByCategory.measures[result.contestfullname].push(result);
          } else {
            resultsByCategory.measures[result.contestfullname] = [result];
          }
        } else {
          if(resultsByCategory.other[result.contestfullname]) {
           resultsByCategory.other[result.contestfullname].push(result);
          } else {
           resultsByCategory.other[result.contestfullname] = [result];
          }
        }
      });
    } else if(selectedCounty === 'ContraCosta') {
      results.forEach(function(result) {
        if(result.contestname.indexOf('Measure') > -1) {
          if(resultsByCategory.measures[result.contestname]) {
            resultsByCategory.measures[result.contestname].push(result);
          } else {
            resultsByCategory.measures[result.contestname] = [result];
          }
        } else {
          if(resultsByCategory.other[result.contestname]) {
            resultsByCategory.other[result.contestname].push(result);
          } else {
            resultsByCategory.other[result.contestname] = [result];
          }
        }
      });
    } else if(selectedCounty === 'SantaClara') {
      resultsByCategory.SanJose = {};
      results.forEach(function(result) {
        if(result.contestname.indexOf('Measure') > -1) {
          if(resultsByCategory.measures[result.contestname]) {
            resultsByCategory.measures[result.contestname].push(result);
          } else {
            resultsByCategory.measures[result.contestname] = [result];
          }
        } else if(result.contestname.indexOf('SAN JOSE') > -1) {
          if(resultsByCategory.SanJose[result.contestname]) {
            resultsByCategory.SanJose[result.contestname].push(result);
          } else {
            resultsByCategory.SanJose[result.contestname] = [result];
          }
        } else {
          if(resultsByCategory.other[result.contestname]) {
            resultsByCategory.other[result.contestname].push(result);
          } else {
            resultsByCategory.other[result.contestname] = [result];
          }
        }
      });
    } else if(selectedCounty === 'Solano') {
      results.forEach(function(result) {
        if(result.officename.indexOf('Measure') > -1) {
          if(resultsByCategory.measures[result.officename]) {
            resultsByCategory.measures[result.officename].push(result);
          } else {
            resultsByCategory.measures[result.officename] = [result];
          }
        } else {
          if(resultsByCategory.other[result.officename]) {
            resultsByCategory.other[result.officename].push(result);
          } else {
            resultsByCategory.other[result.officename] = [result];
          }
        }
      });

    }

    // console.log('resultsByCategory', resultsByCategory);

    return resultsByCategory;
  }
};
