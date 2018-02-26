import babel from 'gulp-babel';
import gulp from 'gulp';

gulp.task('build', gulp.series('lint', () =>
    gulp.src('lib/**')
        .pipe(babel({presets: ['env']}))
        .pipe(gulp.dest('dist'))
));