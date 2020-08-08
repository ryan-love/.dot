var express = require('express');
var router = express.Router();
var path = require("path");
var fs = require("fs");
var crypto = require("crypto")
var bcrypt =require("bcrypt")

var Sequelize = require("sequelize");
const sequelize = new Sequelize(`${process.env.DB_TYPE}://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_DEVELOPMENT_NAME}`);
const Op = Sequelize.Op
// Import models
const Project = sequelize.import("../db/models/project")
const File = sequelize.import("../db/models/file")
const User = sequelize.import("../db/models/user")
const Settings = sequelize.import("../db/models/settings")

Settings.belongsTo(User,{foreignKey:"userID"});
User.hasOne(Settings,{foreignKey:"userID"})
Project.belongsTo(User,{foreignKey:"userid"});
User.hasOne(Project,{foreignKey:"userid"})
File.belongsTo(Project,{foreignKey:"projectfiles",targetKey:"projectID"});
Project.hasMany(File,{foreignKey:"projectfiles",sourceKey:"projectID"})

/* GET home page. */
router.get('/', function(req, res, next) {
    Settings.findOne({
        where:{userID:req.user.id}
    }).then((data)=>{

       res.render("settings",{data:data})
    })

});

module.exports = router;
