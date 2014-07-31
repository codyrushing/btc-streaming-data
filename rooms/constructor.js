var Room = function(io, options){
	this.init();
};

Room.prototype = {
	init: function(){
		io.of();
	}
};

module.exports = Room;