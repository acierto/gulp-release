var argv = require('yargs').argv;
var git = require('gulp-git');
var jeditor = require('gulp-json-editor');
var semver = require('semver');
var util = require('util');
var variables = require('../utils/variables');

var DefaultRegistry = require('undertaker-registry');

function DefaultBumpRegistry(store) {
    DefaultRegistry.call(this);
    this.store = store;
}

var preid = function () {
    if (argv.alpha) {
        return 'alpha';
    }
    if (argv.beta) {
        return 'beta';
    }
    if (argv.RC) {
        return 'RC';
    }
    if (argv['pre-release']) {
        return argv['pre-release'];
    }
    return undefined;
};

var versioning = function () {
    if (preid()) {
        return 'prerelease';
    }
    if (argv.minor) {
        return 'minor';
    }
    if (argv.major) {
        return 'major';
    }
    return 'patch';
};

var commitIt = function (takerInst, version, store, cb) {
    var commitMessage = 'Bumps version to v' + version;
    return takerInst.src('./*.json', variables.srcConfig).pipe(git.commit(commitMessage, {cwd: variables.rootDir}))
        .on('end', function () {
            git.push('origin', store.currentBranch + ':' + store.branch, {cwd: variables.rootDir}, cb);
        });
};

util.inherits(DefaultBumpRegistry, DefaultRegistry);

DefaultBumpRegistry.prototype.init = function (takerInst) {
    var store = this.store;
    takerInst.task('bump', takerInst.series('get-current-branch-name', function (resolve) {
        var newVersion = semver.inc(variables.currentVersion, versioning(), preid());
        git.pull('origin', store.currentBranch + ':' + store.branch, {
            args: '--rebase',
            cwd: variables.rootDir
        }, function () {
            takerInst.src(variables.paths.versionsToBump, variables.srcConfig)
                .pipe(jeditor({
                    'version': newVersion
                }))
                .pipe(takerInst.dest('./', {cwd: variables.rootDir}));

            return commitIt(takerInst, newVersion, store, resolve);
        });
    }));
};

module.exports = DefaultBumpRegistry;