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
  // change current directory to repo directory in local
  shellJs.cd('C:\\Users\\Ryan Love\\WebstormProjects\\.dot');
// Repo name
  const repo = '.dot';  //Repo name
// User name and password of your GitHub
  const userName = process.env.GITU;
  const password = process.env.GITP;
// Set up GitHub url like this so no manual entry of user pass needed
  const gitHubUrl = `https://${userName}:${password}@github.com/${userName}/${repo}`;
// add local git config like username and email
  simpleGit.addConfig('user.email','mmccoopp99@gmail.com');
  simpleGit.addConfig('user.name','ryan-love');
// Add remore repo url as origin to repo
  simpleGitPromise.addRemote('origin',gitHubUrl);
// Add all files for commit
  simpleGitPromise.add('README.md')
      .then(
          (addSuccess) => {
            console.log(addSuccess);
          }, (failedAdd) => {
            console.log('adding files failed ' + failedAdd);
          });
// Commit files as Initial Commit
  simpleGitPromise.commit('README from simple-git')
      .then(
          (successCommit) => {
            console.log(successCommit);
          }, (failed) => {
            console.log('failed commmit '+ failed);
          });
// Finally push to online repository
  simpleGitPromise.push('origin','master')
      .then((success) => {
        console.log('repo successfully pushed ' + JSON.stringify(success));
      },(failed)=> {
        console.log('repo push failed ' + failed);
      });
  res.render("index");
});

module.exports = router;
