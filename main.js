module.exports = function (gulp) {

    var argv = require('yargs').argv;
    var fs = require('fs');
    var git = require('gulp-git');
    var jeditor = require("gulp-json-editor");
    var spawn = require('child_process').spawn;
    var semver = require('semver');
    var tag_version = require('./tag_version');
    var _ = require('lodash');

    var currentBranch;
    var branch = argv.branch || 'master';

    var rootDir = require('path').resolve(argv.rootDir || './') + '/';

    var currVersion = function () {
        return JSON.parse(fs.readFileSync(rootDir + 'package.json')).version;
    };

    var commitIt = function (version, cb) {
        var commitMessage = "Bumps version to v" + version;
        return gulp.src('./*.json', {cwd: rootDir}).pipe(git.commit(commitMessage, {cwd: rootDir}))
            .on('end', function () {
                git.push('origin', currentBranch + ':' + branch, {cwd: rootDir}, cb);
            });
    };

    var paths = {
        versionsToBump: _.map(['package.json', 'bower.json', 'manifest.json'], function (fileName) {
            return rootDir + fileName;
        })
    };

    // can be overrode in the real project i.e. by means of gulp-appfy-tasks.
    gulp.task('pre-tag-and-push', function (cb) {
        cb();
    });

    gulp.task('get-current-branch-name', function (resolve) {
        git.revParse({args: '--abbrev-ref HEAD'}, function (err, branchName) {
            if (!currentBranch) {
                currentBranch = branchName;
            }
            resolve();
        });
    });

    gulp.task('tag-and-push', gulp.series('get-current-branch-name', 'pre-tag-and-push', function (done) {
        return gulp.src('./', {cwd: rootDir})
            .pipe(tag_version({version: currVersion(), cwd: rootDir}))
            .on('end', function () {
                git.push('origin', currentBranch + ':' + branch, {args: '--tags', cwd: rootDir}, done);
            });
    }));

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

    gulp.task('bump', gulp.series('get-current-branch-name', function (resolve) {
        var newVersion = semver.inc(currVersion(), versioning(), preid());
        git.pull('origin', currentBranch + ':' + branch, {args: '--rebase', cwd: rootDir});

        gulp.src(paths.versionsToBump, {allowEmpty: true, cwd: rootDir})
            .pipe(jeditor({
                'version': newVersion
            }))
            .pipe(gulp.dest('./', {cwd: rootDir}));

        return commitIt(newVersion, resolve);
    }));

    gulp.task('npm-publish', function (done) {
        return spawn('npm', ['publish', rootDir], {stdio: 'inherit', shell: true}).on('close', done);
    });

    gulp.task('release', gulp.series('tag-and-push', 'bump'));

    gulp.task('bump-release', gulp.series('bump', 'tag-and-push'));

    gulp.task('complete-release', gulp.series('tag-and-push', 'npm-publish', 'bump'));

    gulp.task('bump-complete-release', gulp.series('bump', 'tag-and-push', 'npm-publish'));
};
