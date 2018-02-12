import DefaultRegistry from 'undertaker-registry';

export default class DefaultReleaseRegistry extends DefaultRegistry {
    init(takerInst) {
        takerInst.task('release', takerInst.series('tag-and-push', 'bump'));
        takerInst.task('bump-release', takerInst.series('bump', 'tag-and-push'));
        takerInst.task('complete-release', takerInst.series('tag-and-push', 'npm-publish', 'bump'));
        takerInst.task('bump-complete-release', takerInst.series('bump', 'tag-and-push', 'npm-publish'));
    }
}