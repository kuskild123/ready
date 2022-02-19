
let dev_folder = '#src';
let dist_folder = 'dist';
let fs = require('fs');

let path = {
	dev: {
		html : [dev_folder + '/*.html', "!" + dev_folder + '/_*.html'] ,
		css: [dev_folder + '/scss/*.scss', "!" + dev_folder + '/scss/_*.scss'] ,
		js: [dev_folder + '/js/*.js', "!" + dev_folder + '/js/_*.js'] ,
		img: dev_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}' ,
		fonts: dev_folder + '/fonts/*.ttf',
		other: dev_folder + '/other/**/*.*'
	},
	dist: {
		html : dist_folder + '/' ,
		css: dist_folder + '/css' ,
		js: dist_folder + '/js' ,
		img: dist_folder + '/img' ,
		fonts: dist_folder + '/fonts',
		other: dist_folder + '/other'
	},
	watch: {
		html : dev_folder + '/' ,
		css: dev_folder + '/scss' ,
		js: dev_folder + '/js' ,
		img: dev_folder + '/fonts'
	},
	clean: './' + dist_folder + '/'
}


// 
const {src, dest} = require('gulp'),
	gulp = require('gulp'),
	browserSync = require('browser-sync').create(),
	fileinclude = require('gulp-file-include'),
	del = require('del'),
	scss =  require ('gulp-sass')(require ('sass')),
	autoprefixer = require('gulp-autoprefixer'),
	gcmq = require('gulp-group-css-media-queries'),
	cleanCss = require('gulp-clean-css'),
	rename = require("gulp-rename"),
	uglify = require('gulp-uglify-es').default,
	babel = require('gulp-babel'), 
	imagemin = require('gulp-imagemin'),
	webp = require('gulp-webp'),
	webpHTML = require('gulp-webp-html'),
	webpCss = require('gulp-webp-css');
	svgSprite = require('gulp-svg-sprite'),
	ttf2woff = require('gulp-ttf2woff'),
	ttf2woff2 = require('gulp-ttf2woff2'),
	fonter = require("gulp-fonter");
function browserSyncFunc() {
	browserSync.init({
		server: {
			baseDir: './' + dist_folder + '/',
		},
		notify: false,
		online: true
	})
}
function html () {
	return src(path.dev.html)
		.pipe(fileinclude())
		.pipe(dest(path.dist.html))
		.pipe(browserSync.stream())
}
function css () {
	return src(path.dev.css)
		.pipe(scss({outputStyle: 'expanded'}).on('error', scss.logError))
		.pipe(gcmq())
		.pipe(autoprefixer({
			cascade: true,
			overrideBrowserslist: ['last 5 versions']
		}))
		.pipe(dest(path.dist.css))
		.pipe(cleanCss())
		.pipe(rename({
			 extname: ".min.css"
		}))
		.pipe(dest(path.dist.css))
		.pipe(browserSync.stream())
}
function other() {
	return src(path.dev.other)
		.pipe(dest(path.dist.other))
}
function watchFiles(params) {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
}

function clean() {
	return del(path.clean);
}
function js () {
	return src(path.dev.js)
		.pipe(fileinclude())
		.pipe(babel({
            presets: ['@babel/env']
        }))
		.pipe(dest(path.dist.js))
		.pipe(uglify())
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(dest(path.dist.js))
		.pipe(browserSync.stream())
}

function images () {
	return src(path.dev.img)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			interlaced: true,
			optimizationLevel: 3
		}))
		.pipe(dest(path.dist.img))
		.pipe(browserSync.stream())
}
function fonts() {
	src(path.dev.fonts)
		.pipe(ttf2woff())
		.pipe(dest(path.dist.fonts))
	return src(path.dev.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.dist.fonts))
}
function fontsStyle(params) {

	let file_content = fs.readFileSync(dev_folder + '/scss/_fonts.scss');
	if (file_content == '') {
		fs.writeFile(dev_folder + '/scss/_fonts.scss', '', cb);
		return fs.readdir(path.dist.fonts, function (err, items) {
		if (items) {
			let c_fontname;
		for (var i = 0; i < items.length; i++) {
			let fontname = items[i].split('.');
			fontname = fontname[0];
		if (c_fontname != fontname) {
			fs.appendFile(dev_folder + '/scss/_fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
		}
		c_fontname = fontname;
		}
		}
		})
	}
}

function cb() { }

function svgSpriteFunc () {
	return gulp.src( [dev_folder + '/iconsprite/*.svg'])
	.pipe(svgSprite({
		mode: {
			stack: {
				sprite: "icons/icons.svg",
				example: true
			}
		}
	}))
	.pipe(dest(path.dist.img))
}

gulp.task('fonter', function() {
	return gulp.src( [dev_folder + '/fonts/*.otf'])
	.pipe(fonter({
		formats: ['ttf']
	}))
	.pipe(dest(dev_folder + '/fonts/'))
})

const build = gulp.series( clean, gulp.parallel(js, html, css, images, fonts, svgSpriteFunc, other), fontsStyle )
const watch = gulp.parallel(build, watchFiles, browserSyncFunc);
exports.other = other;
exports.svgSpriteFunc = svgSpriteFunc;
exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.build = build;
exports.html = html;
exports.watch = watch;
exports.default = watch;