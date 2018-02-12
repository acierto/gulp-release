var util = require('util');
var git = require('gulp-git');

var DefaultRegistry = require('undertaker-registry');

function DefaultGitUtilsRegistry(store) {
    DefaultRegistry.call(this);
    this.store = store;
}

util.inherits(DefaultGitUtilsRegistry, DefaultRegistry);

DefaultGitUtilsRegistry.prototype.init = function (takerInst) {
    var store = this.store;
    takerInst.task('get-current-branch-name', function () {
        return new Promise(function (resolve, reject) {
            git.revParse({args: '--abbrev-ref HEAD'}, function (err, branchName) {
                if (err) {
                    reject(err);
                } else {
                    store.currentBranch = branchName;
                    resolve(branchName);
                }
            });
        });
    });
};

module.exports = DefaultGitUtilsRegistry;