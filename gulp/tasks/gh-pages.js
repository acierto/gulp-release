import gulp from 'gulp';
import ghPages from 'gulp-gh-pages';
import {destDocsDir} from '../utils/paths';

gulp.task('gh-pages', gulp.series('build-docs',
    (cb) => gulp.src(`${destDocsDir}/**`, {allowEmpty: true}).pipe(ghPages(cb))));
