import variables from './utils/variables';
import PreTagAndPushRegistry from './registries/PreTagAndPushRegistry';
import GitUtilsRegistry from './registries/GitUtilsRegistry';
import TagAndPushRegistry from './registries/TagAndPushRegistry';
import ReleaseRegistry from './registries/ReleaseRegistry';
import BumpRegistry from './registries/BumpRegistry';
import NpmPublishRegistry from './registries/NpmPublishRegistry';

export const release = (gulp, opts = {}) => {
    const gulpReleaseStore = {branch: variables.branch};

    if (opts.before) {
        opts.before.map((customRegistry) => gulp.registry(customRegistry));
    }

    gulp.registry(new PreTagAndPushRegistry());
    gulp.registry(new GitUtilsRegistry(gulpReleaseStore));
    gulp.registry(new TagAndPushRegistry());
    gulp.registry(new BumpRegistry(gulpReleaseStore));
    gulp.registry(new NpmPublishRegistry());
    gulp.registry(new ReleaseRegistry());

    if (opts.after) {
        opts.after.map((customRegistry) => gulp.registry(customRegistry));
    }
};

export const DefaultBumpRegistry = BumpRegistry;
export const DefaultGitUtilsRegistry = GitUtilsRegistry;
export const DefaultNpmPublishRegistry = NpmPublishRegistry;
export const DefaultPreTagAndPushRegistry = PreTagAndPushRegistry;
export const DefaultReleaseRegistry = ReleaseRegistry;
export const DefaultTagAndPushRegistry = TagAndPushRegistry;