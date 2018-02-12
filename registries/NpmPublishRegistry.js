var spawn = require('child_process').spawn;
var util = require('util');
var variables = require('../utils/variables');

var DefaultRegistry = require('undertaker-registry');

function DefaultNpmPublishRegistry() {
    DefaultRegistry.call(this);
}

util.inherits(DefaultNpmPublishRegistry, DefaultRegistry);

DefaultNpmPublishRegistry.prototype.init = function (takerInst) {
    takerInst.task('npm-publish', function (done) {
        return spawn('npm', ['publish', variables.rootDir], {stdio: 'inherit', shell: true}).on('close', done);
    });
};

module.exports = DefaultNpmPublishRegistry;