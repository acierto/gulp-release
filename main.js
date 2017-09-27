module.exports = function (gulp) {

    var argv = require('yargs').argv;
    var fs = require('fs');
    var git = require('gulp-git');
    var jeditor = require("gulp-json-editor");
    var runSequence = require('run-sequence');
    var spawn = require('child_process').spawn;
    var semver = require('semver');
    var tag_version = require('./tag_version');
    var _ = require('lodash');

    var branch = argv.branch || 'master';
    var rootDir = require('path').resolve(argv.rootDir || './') + '/';

    var currVersion = function () {
        return JSON.parse(fs.readFileSync(rootDir + 'package.json')).version;
    };

    var commitIt = function (version, cb) {
        var commitMessage = "Bumps version to v" + version;
        gulp.src('./*.json', {cwd: rootDir}).pipe(git.commit(commitMessage, {cwd: rootDir})).on('end', function () {
            git.push('origin', branch, {cwd: rootDir}, function (err) {
                if (err) {
                    console.error(err);
                } else {
                    cb();
                }
            });
        });
    };

    var paths = {
        versionsToBump: _.map(['package.json', 'bower.json', 'manifest.json'], function (fileName) {
            return rootDir + fileName;
        })
    };

    gulp.task('complete-release', function (cb) {
        runSequence('tag-and-push', 'npm-publish', 'bump', cb);
    });

    gulp.task('bump-complete-release', function (cb) {
        runSequence('bump', 'tag-and-push', 'npm-publish', cb);
    });

    gulp.task('release', function (cb) {
        runSequence('tag-and-push', 'bump', cb);
    });

    gulp.task('bump-release', function (cb) {
        runSequence('bump', 'tag-and-push', cb);
    });

    // can be overrode in the real project i.e. by means of gulp-appfy-tasks.
    gulp.task('pre-tag-and-push', function (cb) {
        cb();
    });

    gulp.task('tag-and-push', ['pre-tag-and-push'], function (done) {
        gulp.src('./', {cwd: rootDir})
            .pipe(tag_version({version: currVersion(), cwd: rootDir}))
            .on('end', function () {
                git.push('origin', branch, {args: '--tags', cwd: rootDir}, done);
            });
    });

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

    gulp.task('bump', function (resolve) {
        var newVersion = semver.inc(currVersion(), versioning(), preid());
        git.pull('origin', branch, {args: '--rebase', cwd: rootDir});

        gulp.src(paths.versionsToBump, {cwd: rootDir})
            .pipe(jeditor({
                'version': newVersion
            }))
            .pipe(gulp.dest('./', {cwd: rootDir}));

        commitIt(newVersion, resolve);
    });

    gulp.task('npm-publish', function (done) {
        spawn('npm', ['publish', rootDir], {stdio: 'inherit', shell: true}).on('close', done);
    });

};
