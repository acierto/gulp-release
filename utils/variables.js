var argv = require('yargs').argv;
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var rootDir = path.resolve(argv.rootDir || './') + '/';
var currentVersion = JSON.parse(fs.readFileSync(rootDir + 'package.json')).version;
var srcConfig = {allowEmpty: true, cwd: rootDir};

var paths = {
    versionsToBump: _.map(['package.json', 'bower.json', 'manifest.json'], function (fileName) {
        return rootDir + fileName;
    })
};

module.exports = {
    branch: argv.branch || 'master',
    currentVersion: currentVersion,
    paths: paths,
    rootDir: rootDir,
    srcConfig: srcConfig
};