import git from 'gulp-git';
import DefaultRegistry from 'undertaker-registry';
import variables from '../utils/variables';

export default class DefaultGitUtilsRegistry extends DefaultRegistry {
    constructor(store) {
        super();
        this.store = store;
    }

    init(takerInst) {
        const {rootDir} = variables;

        takerInst.task('get-current-branch-name', () =>
            new Promise((resolve, reject) => {
                git.revParse({args: '--abbrev-ref HEAD', cwd: rootDir}, (err, branchName) => {
                    if (err) {
                        reject(err);
                    } else {
                        this.store.currentBranch = branchName;
                        resolve(branchName);
                    }
                });
            })
        );

        takerInst.task('get-all-tags', () =>
            new Promise((resolve, reject) => {
                git.tag('', '', {args: '-l', cwd: rootDir}, (err, tags) => {
                    if (err) {
                        reject(err);
                    } else {
                        this.store.existedTags = tags;
                        resolve(tags);
                    }
                });
            })
        );
    }
}