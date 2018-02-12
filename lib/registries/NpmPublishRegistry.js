import {spawn} from 'child_process';
import DefaultRegistry from 'undertaker-registry';
import variables from '../utils/variables';

export default class DefaultNpmPublishRegistry extends DefaultRegistry {
    init(takerInst) {
        takerInst.task('npm-publish', (done) =>
            spawn('npm', ['publish', variables.rootDir], {shell: true, stdio: 'inherit'}).on('close', done)
        );
    }
}