module.exports = function(){
	var files = [];
	files.forEach(function(file){
		require("./" + file)(app);
	});
}