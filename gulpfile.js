var gulp = require("gulp"),
	changed = require("gulp-changed"),
	runSequence = require("run-sequence"),
	nodemon = require("gulp-nodemon"),
	plumber = require("gulp-plumber"),
	browserify = require("browserify"),
	jshint = require("gulp-jshint"),
	reactify = require("reactify"),
	browserSync = require("browser-sync"),
	filter = require("gulp-filter"),
	autoprefixer = require('gulp-autoprefixer'),
	lazypipe = require("lazypipe"),
	source = require("vinyl-source-stream"),
	// version of libsass used by gulp-sass is incompatible with susy, so we use gulp-ruby-sass
	sass = require("gulp-ruby-sass"),
	sourcemaps = require("gulp-sourcemaps"),
	path = require("path");

	var srcBase = "public/src/",
		distBase = "public/dist/",
		paths = {
			src: {
				app: srcBase + "app/",
				img: srcBase + "images/",
				sass: srcBase + "sass/"
			},
			dist: {
				js: distBase + "js/",
				img: distBase + "images/",
				css: distBase + "css/"
			}
		},
		nodeArgs = process.argv.filter(function(arg){
			return arg.indexOf("--") === 0;
		});

var jsHintTasks = function(){
	return lazypipe()
		.pipe(plumber)
		.pipe(changed, "./")
		.pipe(jshint, '.jshintrc')
		.pipe(jshint.reporter, 'jshint-stylish')
		.pipe(jshint.reporter, 'fail')
		();
};


// GULP BrowserSync
// Proxy an EXISTING vhost. This will wrap localhost:8090 and open localhost:3000
gulp.task('browser-sync', function() {
	browserSync({
		files: [paths.dist.css + '**/*.css'],
		proxy: 'localhost:3003',
		open: false
	});
});

gulp.task("reactify", function(){
	var b = browserify({
		debug: true
	});
	b.transform(reactify);
	b.add(paths.src.app + "app.js");

	return b.bundle()
		.pipe(plumber())
		.pipe(source("app.js"))
		.pipe(gulp.dest(paths.dist.js));
});

gulp.task("hint", function(){
	return gulp.src(paths.src.app + "app.js")
		.pipe(jsHintTasks());
});

gulp.task("scripts", ["hint", "reactify"]);

/*
* YOU MUST ADD
==============

ulimit -n 2560

==============
TO YOUR .bash_profile, otherwise browserify will fail
*/

gulp.task("mongod", function(){
	return require("child_process").exec("mongod --noauth");
});

gulp.task("server", ["mongod"], function(){
	var r;

	r = nodemon({
		script: "app.js",
		ext: "js",
		nodeArgs: nodeArgs,
		ignore: ["public/", "gulpfile.js", "node_modules/"]
	});

	if(nodeArgs.length){
		require("child_process").spawn("node-inspector");
		// console.log("Node Inspector instance running at http://localhost:8080/debug?port=5858");
		require("child_process").spawn("open", ["http://localhost:8080/debug?port=5858"]);
	}

	return r;

});

gulp.task("img", function(){

	return gulp.src([paths.src.img + "**/*.{png,jpg,gif,svg}"])
		.pipe(plumber())
		.pipe(gulp.dest(paths.dist.img));
});

gulp.task("sass", function(){
		sass(paths.src.sass,{
			sourcemap: true,
			loadPath: ["bower_components"]
		})
		.on("error", function(err){
			console.log("* Sass Error *\n%s", err.message);
		})
		.pipe(autoprefixer({
			browsers: 'last 3 versions'
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest( paths.dist.css ))
		.pipe(filter("**/*.css"))
		.pipe(browserSync.reload({stream: true})) //required for browserSync to work, even though we're useing the 'files' glob below
		;
});

gulp.task("watch", function(){
	gulp.watch([paths.src.app + "**/*.{js,jsx}"], ["reactify"]);
	//gulp.watch([paths.src.js + "**/*.js", "!gulpfile.js"], ["scripts"]);
	gulp.watch([paths.src.sass + "**/*.scss"], ["sass"]);
	gulp.watch(["gulpfile.js"], ["dev"]);
});

gulp.task("dev", ["server", "img", "reactify", "sass", "watch"]);
