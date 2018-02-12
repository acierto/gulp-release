import git from 'gulp-git';
import DefaultRegistry from 'undertaker-registry';
import tagVersion from '../TagVersion';
import variables from '../utils/variables';

export default class DefaultTagAndPushRegistry extends DefaultRegistry {
    init(takerInst) {
        takerInst.task('tag-and-push', takerInst.series('pre-tag-and-push', (resolve, reject) => {
            return takerInst.src('./', variables.srcConfig)
                .pipe(tagVersion({cwd: variables.rootDir, version: variables.currentVersion()}))
                .on('end', () => {
                    git.push('origin', `v${variables.currentVersion()}`, {cwd: variables.rootDir}, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
        }));
    }
}