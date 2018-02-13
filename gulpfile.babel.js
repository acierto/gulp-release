import {DefaultReleaseRegistry, release} from './lib/main';
import eslint from 'gulp-eslint';
import gulp from 'gulp';
import babel from 'gulp-babel';

const lintStream = (stream) => stream
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());

gulp.task('lint', () => lintStream(gulp.src('lib/**/*.js')));

gulp.task('build', gulp.series('lint', () =>
    gulp.src('lib/**')
        .pipe(babel({presets: ['es2015']}))
        .pipe(gulp.dest('dist'))
));

class CustomGulpReleaseRegistry extends DefaultReleaseRegistry {
    init(takerInst) {
        takerInst.task('pre-tag-and-push', takerInst.series('build'));
    }
}

release(gulp, {before: [new CustomGulpReleaseRegistry()]});
