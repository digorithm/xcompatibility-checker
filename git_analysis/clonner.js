/*
 Analyzer is a tool to check both the overall cross-browser compatibility of github projects
 as well as their historical cross-browser compatibility net-worth, i.e. if their compatibility
 increases or decreases overtime.

 Usage:
 - Go to your terminal, move to the root folder, run `node git_analysis/analyzer.js`
 */

require('shelljs/global');
const fs = require('fs');
const Promise = require('promise');
const Git = require("nodegit");
const projects_file = 'git_projects.json';
const tmp_dir = 'git_analysis/tmp';
const projects = JSON.parse(fs.readFileSync(projects_file));

// FIXME remove this: it is here just to speed up tests.
// projects = projects.slice(0, 10);

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

function cloneRepos() {
    return new Promise( function(resolve, reject) {
        console.log('Cloning repos...');
        var promises = [];
        var idx = 1;
        projects.forEach(function (git_project) {

            if (typeof git_project.active !== 'undefined' && git_project.active) {
                var repo = getGitRepositoryName(git_project.git);
                var path = tmp_dir + '/' + repo;
                if (!fs.existsSync(path)){
                    console.log('[' + idx + '] Cloning :: ' + repo);
                    var p = Git.Clone(git_project.git, path);
                    promises.push(p);
                    idx++;
                }
            }
        });

        if (promises.length == 0){
            resolve('success');
        }

        Promise.all(promises).then(function() {
            console.log('\nDone');
            resolve('success');
        }).catch(function(e) {
            resolve('success');
        });
    });
}

function main() {
    console.log('Cloning git repos and measuring xbrowser-compatibility ...');
    makeDir(tmp_dir);
    cloneRepos();
}

main();

