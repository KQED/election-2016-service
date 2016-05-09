"use strict";

module.exports = function(sequelize, DataTypes) {
  var SOSresults = sequelize.define('SOSresults', {
    seatname: DataTypes.STRING,
    lastupdated: DataTypes.STRING,
    totalprecincts: DataTypes.INTEGER,
    precinctsreporting: DataTypes.INTEGER,
    name: DataTypes.STRING,
    affiliation: DataTypes.STRING,
    votecount: DataTypes.INTEGER,
    percentvotes: DataTypes.INTEGER,
    winner: DataTypes.STRING
  });

  SOSresults.removeAttribute('id');

  return SOSresults;
}