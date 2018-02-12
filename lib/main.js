import variables from './utils/variables';
import PreTagAndPuhRegistry from './registries/PreTagAndPushRegistry';
import GitUtilsRegistry from './registries/GitUtilsRegistry';
import TagAndPushRegistry from './registries/TagAndPushRegistry';
import ReleaseRegistry from './registries/ReleaseRegistry';
import BumpRegistry from './registries/BumpRegistry';
import NpmPublishRegistry from './registries/NpmPublishRegistry';

export const release = (gulp, customRegistries) => {
    const gulpReleaseStore = {branch: variables.branch};

    gulp.registry(new PreTagAndPuhRegistry());
    gulp.registry(new GitUtilsRegistry(gulpReleaseStore));
    gulp.registry(new TagAndPushRegistry());
    gulp.registry(new BumpRegistry(gulpReleaseStore));
    gulp.registry(new NpmPublishRegistry());
    gulp.registry(new ReleaseRegistry());

    if (customRegistries) {
        customRegistries.map((customRegistry) => gulp.registry(customRegistry));
    }
};

export const DefaultBumpRegistry = BumpRegistry;
export const DefaultGitUtilsRegistry = GitUtilsRegistry;
export const DefaultNpmPublishRegistry = NpmPublishRegistry;
export const DefaultPreTagAndPuhRegistry = PreTagAndPuhRegistry;
export const DefaultReleaseRegistry = ReleaseRegistry;
export const DefaultTagAndPushRegistry = TagAndPushRegistry;