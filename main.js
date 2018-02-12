var PreTagAndPuhRegistry = require('./registries/PreTagAndPuhRegistry');
var GitUtilsRegistry = require('./registries/GitUtilsRegistry');
var TagAndPushRegistry = require('./registries/TagAndPushRegistry');
var ReleaseRegistry = require('./registries/ReleaseRegistry');
var BumpRegistry = require('./registries/BumpRegistry');
var NpmPublishRegistry = require('./registries/NpmPublishRegistry');


function release(gulp, customRegistries) {
    var variables = require('./utils/variables');
    var gulpReleaseStore = {branch: variables.branch};

    gulp.registry(new PreTagAndPuhRegistry());
    gulp.registry(new GitUtilsRegistry(gulpReleaseStore));
    gulp.registry(new TagAndPushRegistry());
    gulp.registry(new BumpRegistry(gulpReleaseStore));
    gulp.registry(new NpmPublishRegistry());
    gulp.registry(new ReleaseRegistry());

    if (customRegistries) {
        for (var ind = 0; ind < customRegistries.length; ind++) {
            gulp.registry(customRegistries[ind]);
        }
    }
}

module.exports = {
    DefaultBumpRegistry: BumpRegistry,
    DefaultGitUtilsRegistry: GitUtilsRegistry,
    DefaultNpmPublishRegistry: NpmPublishRegistry,
    DefaultPreTagAndPuhRegistry: PreTagAndPuhRegistry,
    DefaultReleaseRegistry: ReleaseRegistry,
    DefaultTagAndPushRegistry: TagAndPushRegistry,
    release: release
};
