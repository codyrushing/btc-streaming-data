var room = function(io, options){
	
	this.init();
};

room.prototype = {
	init: function(){
		io.of()
	}
};

module.exports = function(io){
	var files = ["exchange-rate"];
	files.forEach(function(file){
		new room(io, require("./" + file));
	});
}