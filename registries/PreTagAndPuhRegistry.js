var util = require('util');

var DefaultRegistry = require('undertaker-registry');

function PreTagAndPushRegistry() {
    DefaultRegistry.call(this);
}

util.inherits(PreTagAndPushRegistry, DefaultRegistry);

PreTagAndPushRegistry.prototype.init = function (takerInst) {
    takerInst.task('pre-tag-and-push', function (cb) {
        cb();
    });
};

module.exports = PreTagAndPushRegistry;