import {argv} from 'yargs';
import git from 'gulp-git';
import jeditor from 'gulp-json-editor';
import semver from 'semver';
import DefaultRegistry from 'undertaker-registry';
import variables from '../utils/variables';

const preid = () => {
    if (argv.alpha) {
        return 'alpha';
    }
    if (argv.beta) {
        return 'beta';
    }
    if (argv.RC) {
        return 'RC';
    }
    if (argv['pre-release']) {
        return argv['pre-release'];
    }
    return undefined;
};

const versioning = () => {
    if (preid()) {
        return 'prerelease';
    }
    if (argv.minor) {
        return 'minor';
    }
    if (argv.major) {
        return 'major';
    }
    return 'patch';
};

const commitIt = (takerInst, version, store, cb) => {
    const commitMessage = `Bumps version to v${version}`;
    return takerInst.src('./*.json', variables.srcConfig).pipe(git.commit(commitMessage, {cwd: variables.rootDir}))
        .on('end', () => {
            git.push('origin', `${store.currentBranch}:${store.branch}`, {cwd: variables.rootDir}, cb);
        });
};

export default class DefaultBumpRegistry extends DefaultRegistry {
    constructor(store) {
        super();
        this.store = store;
    }

    init(takerInst) {
        const {currentBranch, branch} = this.store;
        takerInst.task('bump', takerInst.series('get-all-tags', 'get-current-branch-name', (resolve) => {
            const newVersion = this.getNewVersion();
            git.pull('origin', `${currentBranch}:${branch}`, {
                args: '--rebase',
                cwd: variables.rootDir
            }, () => {
                takerInst.src(variables.paths.versionsToBump, variables.srcConfig)
                    .pipe(jeditor({version: newVersion}))
                    .pipe(takerInst.dest('./', {cwd: variables.rootDir}));
                return commitIt(takerInst, newVersion, this.store, resolve);
            });
        }));
    }

    getNewVersion() {
        const {existedTags} = this.store;

        let newVersion = variables.currentVersion();
        do {
            newVersion = semver.inc(newVersion, versioning(), preid());
        } while (existedTags.includes(`v${newVersion}`));

        return newVersion;
    }
}