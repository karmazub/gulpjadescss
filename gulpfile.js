'use strict';
var gulp =         require('gulp'),
		jade =         require('gulp-jade'),
		watch =        require('gulp-watch'),
		sass =         require('gulp-sass'),
		plumber =      require('gulp-plumber'),
		autoprefixer = require('gulp-autoprefixer'),
		imagemin =     require('gulp-imagemin'),
		webserver =    require('gulp-webserver'),
		rename =       require("gulp-rename"),
		notify =       require("gulp-notify"),
		cleanCSS =     require('gulp-clean-css'),
		uncss =        require('gulp-uncss'),
		uglify =       require('gulp-uglify'),
		pump =         require('pump');



var sourceDir = './src/',
		distributionDir = './build/';

gulp.task('compress', function (cb) {
  pump([
        gulp.src(sourceDir + 'js/**/*.js'),
        uglify(),
        gulp.dest(distributionDir + 'js')
    ],
    cb
  );
});

gulp.task('webserver', function () {
	gulp.src('./')
		.pipe(webserver({
			livereload: true,
			directoryListing: true,
			open: true
		}));
});

gulp.task('jade', function () {
	var YOUR_LOCALS = {};

	gulp.src([sourceDir + 'jade/**/*.jade', '!' + sourceDir + 'jade/**/_*.jade'])
		.pipe(jade({
			locals: YOUR_LOCALS,
			pretty: true
		}))
		.pipe(plumber())
		.pipe(gulp.dest(distributionDir + 'pages'))
		.pipe(notify('Jade done!'));
});

gulp.task('sass', function () {
	return gulp.src([sourceDir + 'scss/**/*.scss', '!' + sourceDir + 'scss/**/_*.scss'])
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 15 versions'],
			cascade: false
		}))
		.pipe(plumber())
		.pipe(gulp.dest(distributionDir + 'css'))
		.pipe(cleanCSS({
			compatibility: 'ie8'
		}))
		.pipe(rename({
			suffix: ".min",
			extname: ".css"
		}))
		.pipe(gulp.dest(distributionDir + 'css'))
		.pipe(notify('Scss done!'));
});

gulp.task('imagemin', function () {
	gulp.src(sourceDir + 'img/**/*.*') //img/**/*.+(png|jpg|gif|svg)
		.pipe(imagemin())
		.pipe(gulp.dest(distributionDir + 'img'));
});

gulp.task('watch', function () {
	gulp.watch(sourceDir + 'jade/**/*.jade', ['jade'])
	gulp.watch(sourceDir + 'scss/**/*.scss', ['sass'])
	gulp.watch(sourceDir + 'js/**/*.js', ['compress'])
});

gulp.task('uncss', function () {
    return gulp.src('site.css') //куда смотреть
        .pipe(uncss({
            html: ['index.html', 'posts/**/*.html', 'http://example.com'] //с чем сравниавть
        }))
        .pipe(gulp.dest('./out')); //куда выдавать почисченный файл
});


gulp.task('default', ['imagemin', 'sass', 'jade', 'watch', 'compress', 'webserver']);
