import DefaultRegistry from 'undertaker-registry';

export default class DefaultPreTagAndPushRegistry extends DefaultRegistry {
    init(takerInst) {
        takerInst.task('pre-tag-and-push', (cb) => cb());
    }
}
