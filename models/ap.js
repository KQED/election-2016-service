"use strict";

module.exports = function(sequelize, DataTypes) {

  var APresults = sequelize.define('APresults', {
    officename: DataTypes.STRING,
    seatname: DataTypes.STRING,
    lastupdated: DataTypes.STRING,
    precincts: DataTypes.INTEGER,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    // party: DataTypes.STRING,
    votecount: DataTypes.INTEGER,
    winner: DataTypes.STRING
  });

  APresults.removeAttribute('id');

  return APresults;
};
