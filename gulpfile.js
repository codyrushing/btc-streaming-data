var gulp = require("gulp"),
	gulpif = require("gulp-if"),
	nodemon = require("gulp-nodemon"),
	browserify = require("gulp-browserify"),
	paths = {

	},
	nodeArgs = process.argv.filter(function(arg){
		return arg.indexOf("--") === 0;
	});

gulp.task("scripts", function(){
	gulp.src("public/js/app.js")
		.pipe(browserify())
		.pipe( gulp.dest("public/js/dist") );
});

gulp.task("server", function(){
	nodemon({	
		script: "app.js",
		ext: "js",
		nodeArgs: nodeArgs
	});
	if(nodeArgs.length){
		require("child_process").spawn("node-inspector");
	}			
});

gulp.task("dev", ["server"]);