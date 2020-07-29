var express = require('express');
var router = express.Router();
require("dotenv").config()
// Simple-git without promise
const simpleGit = require('simple-git')();
// Shelljs package for running shell tasks optional
const shellJs = require('shelljs');
// Simple Git with Promise for handling success and failure
const simpleGitPromise = require('simple-git/promise')();

/* GET home page. */
router.get('/', function(req, res, next) {

    simpleGit.status().then((data,err)=>{
        console.log(data)
        simpleGit.commit("index.js commit using simple-git","./routes/index.js").then((commit)=>{
            console.log(commit)
            simpleGit.push("https://github.com/ryan-love/.dot.git","master").then((push)=>{
                console.log(push)
            })
        })

    })

  res.render("index");
});

module.exports = router;
