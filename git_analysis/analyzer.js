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


function checkDir(dir_path) {
    if (!fs.existsSync(dir_path)){
        throw 'No tmp dir defined';
    }
}

function getGitRepositoryName(url) {
    var idx = url.lastIndexOf('/');
    if (idx == -1){
        return undefined;
    }
    return url.substring(idx + 1, url.length);
}

function getFilePath(file) {
    return  tmp_dir + '/' + file;
}

function getFrontendFiles(paths) {
    var files = [];
    var files_folders = paths.split(",");
    files_folders.forEach(function (file) {
        if (file.endsWith('/')) {
            var path = getFilePath(file.substr(0, file.length));
            var jsFiles = find(path).filter(function(_file) { return _file.match(/\.js$/); });
            var htmlFiles = find(path).filter(function(_file) { return _file.match(/\.html$/); });
            var cssFiles = find(path).filter(function(_file) { return _file.match(/\.css$/); });

            files = files.concat(jsFiles);
            files = files.concat(htmlFiles);
            files = files.concat(cssFiles);
        } else {
            files.push(getFilePath(file));
        }
    });

    return files.filter(function (file) {
        return file.match(/\.js$/) || file.match(/\.html$/) || file.match(/\.css$/);
    });
}

function checkXcompatibility() {
    console.log('\nMeasuring cross-browser compatibility...');
    var promises = [];
    var idx = 1;
    projects.forEach(function (git_project) {

        if (typeof git_project.active !== 'undefined' && git_project.active && git_project.hasFrontend) {
            var repo = getGitRepositoryName(git_project.git);
            var frontend = getFrontendFiles(git_project.srcPath);
            console.log('[' + idx + '] Measuting xcompatibility of :: ' + repo);
            console.log(frontend);

            // TODO: call XCompatibility API with the frontend files as a parameter

            idx++;
        }
    });

    console.log('\nDone');
}

function main() {
    console.log('Cloning git repos and measuring xbrowser-compatibility ...');
    checkDir(tmp_dir);
    checkXcompatibility();
}

main();

