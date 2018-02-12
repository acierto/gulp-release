var util = require('util');

var DefaultRegistry = require('undertaker-registry');

function DefaultReleaseRegistry() {
    DefaultRegistry.call(this);
}

util.inherits(DefaultReleaseRegistry, DefaultRegistry);

DefaultReleaseRegistry.prototype.init = function (takerInst) {
    takerInst.task('release', takerInst.series('tag-and-push', 'bump'));

    takerInst.task('bump-release', takerInst.series('bump', 'tag-and-push'));

    takerInst.task('complete-release', takerInst.series('tag-and-push', 'npm-publish', 'bump'));

    takerInst.task('bump-complete-release', takerInst.series('bump', 'tag-and-push', 'npm-publish'));
};

module.exports = DefaultReleaseRegistry;