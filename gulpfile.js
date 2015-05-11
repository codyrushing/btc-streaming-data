var gulp = require("gulp"),
	changed = require("gulp-changed"),
	runSequence = require("run-sequence"),
	nodemon = require("gulp-nodemon"),
	plumber = require("gulp-plumber"),
	browserify = require("browserify"),
	jshint = require("gulp-jshint"),
	reactify = require("reactify"),
	source = require("vinyl-source-stream"),
	// version of libsass used by gulp-sass is incompatible with susy, so we use gulp-ruby-sass
	sass = require("gulp-ruby-sass"),
	sourcemaps = require("gulp-sourcemaps"),
	path = require("path");
	paths = {
		src: {
			app: "public/src/app/",
			sass: "public/src/sass/"
		},
		dist: {
			js: "public/dist/js/",
			css: "public/dist/css/"
		}
	},
	nodeArgs = process.argv.filter(function(arg){
		return arg.indexOf("--") === 0;
	});

// precompile all jsx -> js
gulp.task("react", function(){
	return gulp.src(paths.src.app + "**/*.jsx")
		.pipe(plumber())
		.pipe(react())
		.pipe( gulp.dest(paths.dest.js) );
});

gulp.task("scripts", /*["jshint"],*/ function(){
	return gulp.start("browserify");
});

gulp.task("jshint", function(){
	// jshint all js
	return gulp.src("**/*.js", "!"+paths.dest.js, "!node_modules/")
		.pipe(changed("./"))
		.pipe(plumber())
		.pipe(jshint())
		.pipe(jshint.reporter("jshint-stylish"));
});

gulp.task("browserify", function(){
	return gulp.src(paths.src.js + "app.js")
		.pipe(plumber())
		.pipe(browserify({
			debug: true
		}))
		.pipe( gulp.dest( paths.dest.js ) );
});

gulp.task("reactify", function(){
	var b = browserify();
	b.transform(reactify);
	b.add(paths.src.app + "app.js");

	return b.bundle()
		.pipe(source("app.js"))
		.pipe(gulp.dest(paths.dist.js));
})

/*
* YOU MUST ADD
==============

ulimit -n 2560

==============
TO YOUR .bash_profile, otherwise browserify will fail
*/

gulp.task("server", function(){
	var r;

	require("child_process").exec("mongod --noauth");

	r = nodemon({
		script: "app.js",
		ext: "js",
		nodeArgs: nodeArgs,
		ignore: ["public/", "gulpfile.js"]
	});

	if(nodeArgs.length){
		require("child_process").spawn("node-inspector");
		require("child_process").spawn("open", ["http://localhost:8080/debug?port=5858"]);
	}

	//require("child_process").spawn("open", ["http://localhost:3003/"]);

	return r;

});

gulp.task("sass", function(){
	gulp.src(paths.src.sass + "*.scss")
		.pipe(plumber())
		.pipe(
			sass({loadPath: ["bower_components"], require: "susy"})
		)
		.pipe(gulp.dest( paths.dest.css ));
});

gulp.task("watch", function(){
	gulp.watch([paths.src.app + "**/*.{js,jsx}"], ["reactify"]);
	//gulp.watch([paths.src.js + "**/*.js", "!gulpfile.js"], ["scripts"]);
	gulp.watch([paths.src.sass + "**/*.scss"], ["sass"]);
	gulp.watch(["gulpfile.js"], ["dev"]);
});

gulp.task("dev", ["server", "react", "scripts", "sass", "watch"]);
