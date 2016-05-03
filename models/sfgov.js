"use strict";

module.exports = function(sequelize, DataTypes) {
  var SFgovResults = sequelize.define('SFgovResults', {
    officename: DataTypes.STRING,
    seatname: DataTypes.STRING,
    lastupdated: DataTypes.STRING,
    precincts: DataTypes.INTEGER,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    votecount: DataTypes.INTEGER,
    winner: DataTypes.STRING
  });

  return SFgovResults;
}