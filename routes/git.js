var express = require('express');
var router = express.Router();
var Sequelize = require("sequelize");
const sequelize = new Sequelize(`${process.env.DB_TYPE}://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_DEVELOPMENT_NAME}`);
const Op = Sequelize.Op
const Settings = sequelize.import("../db/models/settings")

require("dotenv").config()
// Simple-git without promise
const simpleGit = require('simple-git')({ maxConcurrentProcesses: 10 });
// Shelljs package for running shell tasks optional
const shellJs = require('shelljs');
// Simple Git with Promise for handling success and failure
const simpleGitPromise = require('simple-git/promise')();

/* GET home page. */
router.get('/', function(req, res, next) {

    simpleGit.listConfig().then((config)=>{


        Settings.create({
            setGit: {
                config:config
            }
        }).then(result=>res.json(result))
    })
});

module.exports = router;
