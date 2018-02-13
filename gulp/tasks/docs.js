import gulp from 'gulp';
import gulpGitbook from 'gulp-gitbook';
import {srcDocsDir, destDocsDir} from '../utils/paths';

gulp.task('generate-docs', (cb) => gulpGitbook(srcDocsDir, cb));

gulp.task('copy-docs', () => gulp
    .src(`${srcDocsDir}/_book/**`)
    .pipe(gulp.dest(destDocsDir)));


gulp.task('build-docs', gulp.series('generate-docs', 'copy-docs'));