var _ = require("lodash");
// SERVER
var Room = function(io, options){
	this.io = io;
	_.extend(this, options);
	console.log(this);
	this.init();
};

Room.prototype = {
	init: function(){
		//
	},
	on_join: function(data, socket){
		console.log(this.io.sockets.to(this.roomName));
	},
	on_leave: function(data, socket){
		console.log("leave");
	}
};

module.exports = Room;