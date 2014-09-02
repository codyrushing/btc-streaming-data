var gulp = require("gulp"),
	gulpif = require("gulp-if"),
	nodemon = require("gulp-nodemon"),
	plumber = require("gulp-plumber"),
	compass = require("gulp-compass"),
	react = require("gulp-react"),
	browserify = require("gulp-browserify"),
	jshint = require("gulp-jshint"),
	path = require("path");
	paths = {
		src: {
			js: "public/src/js/",
			views: "public/src/jsx/views/",
			sass: "public/sass/"
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
	gulp.src(paths.src.views + "**/*.jsx")
		.pipe(plumber())
		.pipe(react())
		.pipe( gulp.dest(paths.dest.views) );
});

gulp.task("scripts", function(){
	// jshint all js
	gulp.src(paths.src.js + "**/*.js")
		.pipe(plumber())
		.pipe(jshint())
		.pipe(jshint.reporter("jshint-stylish"));

	// then browserify it
	gulp.src(paths.src.js + "app.js")
		.pipe(plumber())
		.pipe(browserify())
		.pipe( gulp.dest( paths.dest.js ) );
});

gulp.task("browserify", function(){
	// then browserify it
	gulp.src(paths.src.js + "app.js")
		.pipe(plumber())
		.pipe(browserify())
		.pipe( gulp.dest( paths.dest.js ) );
});

gulp.task("server", function(){
	nodemon({	
		script: "app.js",
		ext: "js",
		nodeArgs: nodeArgs,
		ignore: ["public/", "gulpfile.js"]
	});
	if(nodeArgs.length){
		require("child_process").spawn("node-inspector");
	}			
});

gulp.task("compass", function(){
	gulp.src("public/sass/*.scss")
		.pipe(plumber())
		.pipe(compass({
			project: path.join(__dirname, "public"),
			config_file: "./config.rb"
		}))
		.pipe(gulp.dest( paths.dest.css ))
});

gulp.task("watch", function(){
	gulp.watch([paths.src.views + "**/*.jsx"], ["react"]);
	gulp.watch([paths.src.js + "**/*.js"], ["scripts"]);
	gulp.watch([paths.src.sass + "**/*.scss"], ["compass"]);
});

gulp.task("dev", ["server", "react", "scripts", "compass", "watch"]);