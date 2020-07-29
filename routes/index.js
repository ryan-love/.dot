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
    simpleGit.addConfig("user.username","ryan-love").then((user)=>{
        simpleGit.addConfig("user.profileUrl",`https://${process.env.GITU}:${process.env.GITP}@github.com/ryan-love`).then((profile)=>{
    simpleGit.status().then((data,err)=> {
        console.log(data)
        simpleGit.commit("index.js commit using simple-git", "./routes/index.js").then((commit) => {
            console.log(commit)
            simpleGit.push(`https://${process.env.GITU}:${process.env.GITP}@github.com/ryan-love/.dot.git`, "master").then((push) => {
                Settings.create({
                    setGit: {
                        status: data,
                        commit: commit,
                        push: push,
                        user:user,
                        profile:profile
                    }
                }).then(result=>res.json(result))
            })
        })
    })
        })
    })


});

module.exports = router;
