import git from 'gulp-git';
import DefaultRegistry from 'undertaker-registry';

export default class DefaultGitUtilsRegistry extends DefaultRegistry {
    constructor(store) {
        super();
        this.store = store;
    }

    init(takerInst) {
        const store = this.store;
        takerInst.task('get-current-branch-name', () =>
            new Promise((resolve, reject) => {
                git.revParse({args: '--abbrev-ref HEAD'}, (err, branchName) => {
                    if (err) {
                        reject(err);
                    } else {
                        store.currentBranch = branchName;
                        resolve(branchName);
                    }
                });
            })
        );
    }
}