import DefaultRegistry from 'undertaker-registry';

export default class DefaultPreTagAndPushRegistry extends DefaultRegistry {
    init(takerInst) {
        const taskName = 'pre-tag-and-push';
        if (!Object.keys(this._tasks).includes(taskName)) {
            takerInst.task(taskName, (cb) => cb());
        }
    }
}
