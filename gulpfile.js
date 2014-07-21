var gulp = require("gulp"),
	nodemon = require("gulp-nodemon"),
	paths = {

	};

gulp.task("nodemon", function(){
	nodemon({	
		script: "app.js",
		ext: "js",
		nodeArgs: "--debug"
	});
});

gulp.task("dev", ["nodemon"]);