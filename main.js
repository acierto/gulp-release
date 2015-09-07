module.exports = function (gulp) {

    if (!String.prototype.endsWith) {
        Object.defineProperty(String.prototype, 'endsWith', {
            value: function (searchString, position) {
                var subjectString = this.toString();
                if (position === undefined || position > subjectString.length) {
                    position = subjectString.length;
                }
                position -= searchString.length;
                var lastIndex = subjectString.indexOf(searchString, position);
                return lastIndex !== -1 && lastIndex === position;
            }
        });
    }

    var argv = require('yargs').argv;
    var bump = require('gulp-bump');
    var filter = require('gulp-filter');
    var fs = require('fs');
    var git = require('gulp-git');
    var runSequence = require('gulp-run-sequence');
    var spawn = require('child_process').spawn;
    var tag_version = require('gulp-tag-version');
    var _ = require('lodash');

    var branch = argv.branch || 'master';
    var rootDir = argv.rootDir || './';

    if (!rootDir.endsWith('/')) {
        rootDir = rootDir + '/';
    }

    var paths = {
        versionsToBump: _.map(['package.json', 'bower.json', 'manifest.json'], function(fileName) {
            return rootDir + fileName;
        })
    };

    gulp.task('release', function (cb) {
        runSequence('tag-and-push', 'bump', cb);
    });

    gulp.task('tag-and-push', function () {

        var message = "Release";
        var pkg = require('./package.json');

        return gulp.src('./', {cwd: rootDir})
            .pipe(git.commit(message))
            .pipe(git.tag(pkg.version, message))
            .pipe(git.push('origin', branch, '--tags'))
            .pipe(gulp.dest('./', {cwd: rootDir}));
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
        return gulp.src(paths.versionsToBump, {cwd: rootDir})
            .pipe(bump({type: versioning()}))
            .pipe(gulp.dest('./', {cwd: rootDir}))
            .pipe(git.commit('Bumps package version to ', {cwd: rootDir}))
            .pipe(filter('package.json'))
            .pipe(tag_version({cwd: rootDir}))
            .on('end', function(){
                this.pipe(git.push('origin', branch, {args: '--tags', cwd: rootDir}));
            });
    });

    gulp.task('npm-publish', function (done) {
        spawn('npm', ['publish', rootDir], {stdio: 'inherit'}).on('close', done);
    });

};
