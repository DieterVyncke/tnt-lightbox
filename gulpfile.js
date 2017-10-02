const
	gulp = require('gulp'),
	browserify = require('browserify'),
	watch = require('gulp-watch'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	del = require( 'del'),
	uglify = require('gulp-uglify')
;

gulp.task( 'watch', function() {
	watch( 'src/**/*.js', function() {

		gulp.start( 'build' );
	} );
} );


gulp.task( 'build', function() {

	del( [ 'build/' ] );

	return browserify( 'example/src/example.js' )
		.transform( 'babelify', { presets: ['es2015'] } )
		.bundle()
		.pipe( source( 'example.js' ) )
		.pipe( buffer() )
		.pipe( uglify() )
		.pipe( gulp.dest( 'build' ) )
	;
} );

gulp.task( 'default', [ 'watch' ] );