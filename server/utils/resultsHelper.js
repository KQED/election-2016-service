module.exports = {

  createContestIdsArray: function(range1, range2, range3, range4, range5, range6, range7, range8) {
    var contestIds = [];
    for(var i = range1; i < range2; i++) {
      contestIds.push(i.toString());
    }
    for(var i = range3; i < range4; i++) {
      contestIds.push(i.toString());
    }
    for(var i = range5; i < range6; i++) {
      contestIds.push(i.toString());
    }
    for(var i = range7; i < range8; i++) {
      contestIds.push(i.toString());
    }
    return contestIds;
  },

  checkRaceDetails: function(raceName) {
    var raceDetails = null;

    if(raceName.indexOf('2/3') > -1) {
      raceDetails = 'Passage requires two-thirds of the vote.';
    } else if(raceName.indexOf('55%') > -1) {
      raceDetails = 'Passage requires 55 percent of the vote.';
    } else if(raceName.indexOf('Majority') > -1 || raceName.indexOf('majority') > -1) {
      raceDetails = 'Passage requires a majority of the vote.';
    } 

    return raceDetails;
  },

  assignRaceThresholds: function(raceId, county) {
    var twoThirdsIds;
    var fiftyFiveIds;
    var majorityIds;
    var raceDetails = null;
    if(county === 'Alameda') {
      twoThirdsIds = ['102', '103', '104', '105', '114', '118', '135', '141', '142', '143', '144'];
      fiftyFiveIds = ['106', '107', '108'];
      majorityIds = ['109', '110', '111', '112', '113', '115', '116', '117', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '136', '137', '138', '139', '140'];
    } else if(county === 'SF') {
      twoThirdsIds = ['38', '39', '55', '61'];
      fiftyFiveIds = ['37'];
      majorityIds = ['40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '56', '57', '58', '59', '60'];
    } else if(county === 'SC') {
      twoThirdsIds = ['294', '295', '296', '297', '342', '343', '348', '349', '352', '353', '354', '355', '356', '357'];
      fiftyFiveIds = ['340', '341', '350', '351'];
      majorityIds = ['298', '299', '300', '301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325', '326', '327', '328', '329', '330', '331', '332', '333', '334', '335', '336', '337', '338', '339'];
    } else if(county === 'Sonoma') {
      twoThirdsIds = ['60', '61', '62', '71', '77'];
      fiftyFiveIds = ['55', '56', '57', '58', '59', '76'];
      majorityIds = ['63', '64', '65', '66', '67', '68', '69', '70', '72', '73', '74', '75'];
    }

    if(twoThirdsIds.indexOf(raceId) > -1) {
      raceDetails = 'Passage requires two-thirds of the vote.';
    } else if(fiftyFiveIds.indexOf(raceId) > -1) {
      raceDetails = 'Passage requires 55 percent of the vote.';
    } else if(majorityIds.indexOf(raceId) > -1) {
      raceDetails = 'Passage requires a majority of the vote.';
    }

    return raceDetails;
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
      resultsByCategory['San Jose'] = {};
      results.forEach(function(result) {
        if(result.contestname.indexOf('Measure') > -1) {
          if(resultsByCategory.measures[result.contestname]) {
            resultsByCategory.measures[result.contestname].push(result);
          } else {
            resultsByCategory.measures[result.contestname] = [result];
          }
        } else if(result.contestname.indexOf('SAN JOSE') > -1 || result.contestname.indexOf('San Jose') > -1) {
          if(resultsByCategory['San Jose'][result.contestname]) {
            resultsByCategory['San Jose'][result.contestname].push(result);
          } else {
            resultsByCategory['San Jose'][result.contestname] = [result];
          }
        } else {
          if(resultsByCategory.other[result.contestname]) {
            resultsByCategory.other[result.contestname].push(result);
          } else {
            resultsByCategory.other[result.contestname] = [result];
          }
        }
      });
    } else if(selectedCounty === 'Napa') {
      results.forEach(function(result) {
        if(result.fullofficename.indexOf('Measure') > -1) {
          if(resultsByCategory.measures[result.fullofficename]) {
            resultsByCategory.measures[result.fullofficename].push(result);
          } else {
            resultsByCategory.measures[result.fullofficename] = [result];
          }
        } else {
          if(resultsByCategory.other[result.fullofficename]) {
            resultsByCategory.other[result.fullofficename].push(result);
          } else {
            resultsByCategory.other[result.fullofficename] = [result];
          }
        }
      });
    } else {
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
    return resultsByCategory;
  }
}