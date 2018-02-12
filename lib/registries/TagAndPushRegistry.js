import git from 'gulp-git';
import DefaultRegistry from 'undertaker-registry';
import tagVersion from '../TagVersion';
import variables from '../utils/variables';

export default class DefaultTagAndPushRegistry extends DefaultRegistry {
    init(takerInst) {
        takerInst.task('tag-and-push', takerInst.series('pre-tag-and-push', (resolve, reject) => {
            const currentVersion = variables.currentVersion;
            return takerInst.src('./', variables.srcConfig)
                .pipe(tagVersion({cwd: variables.rootDir, version: currentVersion}))
                .on('end', () => {
                    git.push('origin', `v${currentVersion}`, {cwd: variables.rootDir}, (err) => {
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