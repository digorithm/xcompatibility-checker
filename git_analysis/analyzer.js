/*
 Analyzer is a tool to check both the overall cross-browser compatibility of github projects
 as well as their historical cross-browser compatibility net-worth, i.e. if their compatibility
 increases or decreases overtime.

 Usage:
 - Go to your terminal, move to the root folder, run `node git_analysis/analyzer.js`
 */

const fs = require('fs');
const Promise = require('promise');
const Git = require("nodegit");

const config = require('../git.config.json');

const projects_file = 'git_projects.json';
const tmp_dir = 'git_analysis/tmp';
var projects = JSON.parse(fs.readFileSync(projects_file));

// FIXME remove this: it is here just to speed up tests.
projects = projects.slice(0, 3);


function makeDir(dir_path) {
    if (!fs.existsSync(dir_path)){
        fs.mkdirSync(dir_path);
    }
}

function getGitRepositoryName(url) {
    var idx = url.lastIndexOf('/');
    if (idx == -1){
        return undefined;
    }
    return url.substring(idx + 1, url.length);
}

function getFrontendFilesFolders(paths) {
    return paths.split(",");
}

function cloneRepos() {
    console.log('Cloning repos...');
    var promises = [];
    var idx = 0;
    projects.forEach(function (git_project) {

        if (typeof git_project.active !== 'undefined' && git_project.active) {
            var repo = getGitRepositoryName(git_project.git);
            var path = tmp_dir + '/' + repo;
            console.log('[' + idx + '] Cloning :: ' + repo);
            var p = Git.Clone(git_project.git, path).then(function (result) {
                console.log('>> successfully cloned :: ' + repo);
            });

            promises.push(p);
            idx++;
        }
    });

    Promise.all(promises).then(function() {
        console.log('\nDone');
    });
}

function getXcompatibility() {
    console.log('\nMeasuring cross-browser compatibility...');
    var promises = [];
    var idx = 0;
    projects.forEach(function (git_project) {

        if (typeof git_project.active !== 'undefined' && git_project.active && git_project.hasFrontend) {
            var repo = getGitRepositoryName(git_project.git);
            var frontend = getFrontendFilesFolders(git_project.srcPath);

            console.log('[' + idx + '] Measuting xcompatibility of :: ' + repo);

            frontend.forEach(function (file) {
                var path = tmp_dir + '/' + file;
                console.log('   ' + path);

            });


            idx++;
        }
    });

    console.log('\nDone');
}


function main() {
    console.log('Cloning git repos and measuring xbrowser-compatibility ...');
    makeDir(tmp_dir);
    cloneRepos();
    getXcompatibility();
}

main();

