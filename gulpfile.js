var gulp = require("gulp"),
	gulpif = require("gulp-if"),
	nodemon = require("gulp-nodemon"),
	browserify = require("gulp-browserify"),
	jshint = require("gulp-jshint"),
	paths = {
		src: {
			js: "public/src/js/"
		},
		dest: {
			js: "public/js/"
		}
	},
	nodeArgs = process.argv.filter(function(arg){
		return arg.indexOf("--") === 0;
	});

gulp.task("scripts", function(){
	gulp.src(paths.src.js + "**/*.js")
		.pipe(jshint())
		.pipe(jshint.reporter("default"))

	gulp.src(paths.src.js + "app.js")
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

gulp.task("watch", function(){
	gulp.watch([paths.src.js + "**/*.js"], ["scripts"]);
});

gulp.task("dev", ["server", "scripts", "watch"]);