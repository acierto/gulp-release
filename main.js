module.exports = function (gulp) {

    var argv = require('yargs').argv;
    var bump = require('gulp-bump');
    var filter = require('gulp-filter');
    var fs = require('fs');
    var git = require('gulp-git');
    var runSequence = require('gulp-run-sequence');
    var s = require('string');
    var spawn = require('child_process').spawn;
    var tag_version = require('gulp-tag-version');
    var through = require('through2');
    var _ = require('lodash');

    var branch = argv.branch || 'master';
    var rootDir = argv.rootDir || './';

    if (!s(rootDir).endsWith('/')) {
        rootDir = rootDir + '/';
    }

    var readPackageVersion = function(filePath) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8')).version;
    };

    var commitIt = function (file, enc, cb) {
        if (file.isNull()) return cb(null, file);
        if (file.isStream()) return cb(new Error('Streaming not supported'));

        var commitMessage = "Bumps version to " + readPackageVersion(file.path);
        gulp.src('./*.json', {cwd: rootDir}).pipe(git.commit(commitMessage, {cwd: rootDir}));
    };

    var paths = {
        versionsToBump: _.map(['package.json', 'bower.json', 'manifest.json'], function (fileName) {
            return rootDir + fileName;
        })
    };

    gulp.task('release', function (cb) {
        runSequence('tag-and-push', 'npm-publish', 'bump', cb);
    });

    gulp.task('tag-and-push', function () {
        var pkg = require(rootDir + './package.json');

        return gulp.src('./', {cwd: rootDir})
            .pipe(tag_version({version: pkg.version, cwd: rootDir}))
            .on('end', function () {
                git.push('origin', branch, {args: '--tags', cwd: rootDir});
            });
    });

    var versioning = function () {
        if (argv.minor) {
            return 'minor';
        }
        if (argv.major) {
            return 'major';
        }
        return 'patch';
    };

    gulp.task('bump', function () {
        gulp.src(paths.versionsToBump, {cwd: rootDir})
            .pipe(bump({type: versioning()}))
            .pipe(gulp.dest('./', {cwd: rootDir}))
            .pipe(through.obj(commitIt))
            .pipe(git.push('origin', branch, {cwd: rootDir}));
    });

    gulp.task('npm-publish', function (done) {
        spawn('npm', ['publish', rootDir], {stdio: 'inherit'}).on('close', done);
    });

};
