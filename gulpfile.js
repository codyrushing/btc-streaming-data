var gulp = require("gulp"),
	gulpif = require("gulp-if"),
	nodemon = require("gulp-nodemon"),
	plumber = require("gulp-plumber"),
	compass = require("gulp-compass"),
	browserify = require("gulp-browserify"),
	jshint = require("gulp-jshint"),
	path = require("path");
	paths = {
		src: {
			js: "public/src/js/",
			sass: "public/sass"
		},
		dest: {
			js: "public/js/",
			css: "public/css"
		}
	},
	nodeArgs = process.argv.filter(function(arg){
		return arg.indexOf("--") === 0;
	});

gulp.task("scripts", function(){
	gulp.src(paths.src.js + "**/*.js")
		.pipe(plumber())
		.pipe(jshint())
		.pipe(jshint.reporter("jshint-stylish"));

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
		.pipe(compass({
			project: path.join(__dirname, "public"),
			config_file: "./config.rb"
		}))
		.pipe(gulp.dest( paths.dest.css ))
});

gulp.task("watch", function(){
	gulp.watch([paths.src.js + "**/*.js"], ["scripts"]);
	gulp.watch([paths.src.sass + "**/*.scss"], ["compass"])
});

gulp.task("dev", ["server", "scripts", "compass", "watch"]);