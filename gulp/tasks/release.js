import gulp from 'gulp';
import {DefaultReleaseRegistry, release} from '../../lib/main';

class CustomGulpReleaseRegistry extends DefaultReleaseRegistry {
    init(takerInst) {
        takerInst.task('pre-tag-and-push', takerInst.series('build'));
    }
}

release(gulp, {before: [new CustomGulpReleaseRegistry()]});
