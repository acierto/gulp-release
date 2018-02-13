import eslint from 'gulp-eslint';
import gulp from 'gulp';

const lintStream = (stream) => stream
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());

gulp.task('lint', () => lintStream(gulp.src('lib/**/*.js')));