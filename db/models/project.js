'use strict';
const Sequelize = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    projectID:{

      type: DataTypes.UUID,
      defaultValue:sequelize.UUIDV4,
      primaryKey:true
    },
    projectName: DataTypes.STRING,
    userid: DataTypes.INTEGER
  }, {});
  Project.associate = function(models) {
    // associations can be defined here
    Project.belongsTo(models.User,{foreignKey:"userid"});
  };
  return Project;
};