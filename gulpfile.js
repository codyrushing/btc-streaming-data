var gulp = require("gulp"),
	gulpif = require("gulp-if"),
	changed = require("gulp-changed"),
	runSequence = require("run-sequence"),
	nodemon = require("gulp-nodemon"),
	plumber = require("gulp-plumber"),
	react = require("gulp-react"),
	browserify = require("gulp-browserify"),
	jshint = require("gulp-jshint"),
	// version of libsass used by gulp-sass is incompatible with susy, so we use gulp-ruby-sass
	sass = require("gulp-ruby-sass"),
	sassSourcemaps = require("gulp-sourcemaps"),
	path = require("path");
	paths = {
		src: {
			js: "public/src/js/",
			views: "public/src/jsx/views/",
			sass: "public/src/sass/"
		},
		dest: {
			js: "public/js/",
			views: "public/src/js/views/",
			css: "public/css/"
		}
	},
	nodeArgs = process.argv.filter(function(arg){
		return arg.indexOf("--") === 0;
	});

// precompile all jsx -> js
gulp.task("react", function(){
	return gulp.src(paths.src.views + "**/*.jsx")
		.pipe(plumber())
		.pipe(react())
		.pipe( gulp.dest(paths.dest.views) );
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

	if(nodeArgs){		
		require("child_process").spawn("node-inspector");
		require("child_process").spawn("open", ["http://localhost:8080/debug?port=5858"]);
	}

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
	gulp.watch([paths.src.views + "**/*.jsx"], ["react"]);
	gulp.watch([paths.src.js + "**/*.js", "!gulpfile.js"], ["scripts"]);
	gulp.watch([paths.src.sass + "**/*.scss"], ["sass"]);
	gulp.watch(["gulpfile.js"], ["dev"]);
});

gulp.task("dev", ["server", "react", "scripts", "sass", "watch"]);