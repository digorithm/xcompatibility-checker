/*
 Extractor is a tool to extract the overall data of github projects, e.g. number of contributors,
 project size, pull requests, etc

 Usage:
 - Go to your terminal, move to the root folder, run `node git_analysis/extractor.js`
 */

const fs = require('fs');
const request = require('request');
const Promise = require('promise');
const _ = require('underscore');

const config = require('../git.config.json');
const baseURL = 'https://api.github.com/repos/';

const projects_file = 'git_projects.json';
const projects = JSON.parse(fs.readFileSync(projects_file));

function saveToDisk(data) {
    fs.writeFileSync(projects_file, JSON.stringify(data));
}

function yearsSince(lastCommitDate) {
    var ageDifMs = Date.now() - lastCommitDate.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function gitAPIRequest(repository, endpoint, resolve, reject) {
    var options = {
        url: baseURL + repository + endpoint,
        headers: {
            'User-Agent': 'request',
            'Authorization': 'token ' + config.oauth_token
        }
    };

    function callback(error, response, body) {
        if (error) {
            reject(error);
        } else {
            if (response.statusCode) {
                var data = JSON.parse(body);
                resolve(data);
            } else {
                reject(response.statusCode);
            }
        }
    }

    request(options, callback);
}

function getGitRepository(git_url) {
    var git_regex = /https:\/\/github.com\//g;
    return git_url.replace(git_regex, '');
}

function getCommits(repository) {
    return new Promise( function(resolve, reject) {
        var endpoint = '/commits';
        gitAPIRequest(repository, endpoint, resolve, reject);
    });
}

function getLastCommit(commits) {
    if (commits && commits.length > 0){
        commits.sort(function(a, b) {
            return (new Date(a.commit.author.date)) - (new Date(b.commit.author.date));
        });
        return commits[0];
    }
    return undefined;
}

console.log(projects.length);
console.log(config);


var promises = [];

projects.forEach(function (git_project) {
    var repo = getGitRepository(git_project.git);

    if (typeof git_project.active === 'undefined') {
        var p = getCommits(repo).then(function (response) {
            git_project.commits = response;
        }).catch(function (err) {
            console.log(err);
        });

        promises.push(p);
    }
});

Promise.all(promises).then(function () {
    projects.forEach(function (git_project) {
        if (typeof git_project.active === 'undefined'){
            var last = getLastCommit(git_project.commits);
            if (!_.isUndefined(last)){
                var lastCommitDate = new Date(last.commit.author.date);
                git_project.active = yearsSince(lastCommitDate) <= 1;
            } else {
                git_project.active = false;
            }
            delete git_project.commits;
        }
    });

    saveToDisk(projects);
});

console.log('Done');
var active = projects.filter(function (git_project) {
    return git_project.active == true;
});
var inactive = projects.filter(function (git_project) {
    return git_project.active == false;
});

console.log('TOTAL :: ' + (active.length + inactive.length));
console.log('>> Active :: ' + active.length);
console.log('>> Inactive :: ' + inactive.length);


