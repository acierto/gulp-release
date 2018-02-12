var colors = require('ansi-colors');
var flog = require('fancy-log');
var git = require('gulp-git');
var tag_version = require('../tag_version');
var util = require('util');
var variables = require('../utils/variables');

var DefaultRegistry = require('undertaker-registry');

function DefaultTagAndPushRegistry() {
    DefaultRegistry.call(this);
}

util.inherits(DefaultTagAndPushRegistry, DefaultRegistry);

DefaultTagAndPushRegistry.prototype.init = function (takerInst) {
    takerInst.task('tag-and-push', takerInst.series('pre-tag-and-push', function (done) {
        var currentVersion = variables.currentVersion;
        return takerInst.src('./', variables.srcConfig)
            .pipe(tag_version({version: currentVersion, cwd: variables.rootDir}))
            .on('end', function () {
                git.push('origin', 'v' + currentVersion, {cwd: variables.rootDir}, function (err) {
                    if (err) {
                        flog(colors.red(err));
                    }
                    done();
                });
            });
    }));
};

module.exports = DefaultTagAndPushRegistry;