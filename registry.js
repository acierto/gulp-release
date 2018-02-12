var util = require('util');

var DefaultRegistry = require('undertaker-registry');

function DefaultGulpReleaseRegistry() {
    DefaultRegistry.call(this);
}

util.inherits(DefaultGulpReleaseRegistry, DefaultRegistry);

DefaultGulpReleaseRegistry.prototype.init = function (takerInst) {
    takerInst.task('pre-tag-and-push', function (cb) {
        cb();
    });
};

module.exports = DefaultGulpReleaseRegistry;