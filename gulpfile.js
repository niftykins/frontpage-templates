var gulp = require('gulp');
var gutil = require('gulp-util');
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var http = require('http');
var livereload = require('gulp-livereload');
var ecstatic = require('ecstatic');
var notifier = require('node-notifier');

var handle_error = function(e) {
	gutil.log(gutil.colors.red(e.message));
	if (e.fileName) gutil.log(gutil.colors.red(e.fileName));

	var n = new notifier();
	n.notify({title: 'Build Error', message: e.message});
};

gulp.task('http', function() {
	http.createServer(
		ecstatic({ root: __dirname + '/dist' })
	).listen(3005);

	gutil.log('HTTP listening on', gutil.colors.yellow('3005'));
});

gulp.task('css', function() {
	var s = stylus({errors: true, compress: false, 'include css': true})
		.on('error', function(e) {
			handle_error(e);
			s.end();
			return false;
		});

	return gulp.src('src/css/base.styl')
		.pipe(s)
		.pipe(autoprefixer())
		.pipe(gulp.dest('dist/css'));
});

gulp.task('watch', function() {
	livereload.listen();

	gulp.watch('src/css/*', ['css']);
	gulp.watch('dist/*/**').on('change', function(f) { livereload.changed(f.path); });
	gulp.watch('dist/*.html').on('change', function(f) { livereload.changed(f.path); });
});

gulp.task('default', ['http', 'css', 'watch']);
