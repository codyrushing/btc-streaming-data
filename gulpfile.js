var gulp = require("gulp"),
	shell = require("gulp-shell"),
	gulpif = require("gulp-if"),
	nodemon = require("gulp-nodemon"),
	paths = {

	},
	nodeArgs = process.argv.filter(function(arg){
		return arg.indexOf("--") === 0;
	}),
	server = function(){
		nodemon({	
			script: "app.js",
			ext: "js",
			nodeArgs: nodeArgs
		});
		if(nodeArgs.length){
			require("child_process").spawn("node-inspector");
		}			
	};

gulp.task("dev", [], function(){
	server();
});