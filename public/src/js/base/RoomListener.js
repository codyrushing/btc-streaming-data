var io = require("socket.io-client");

var RoomListener = function(options){
	this.options = options;
	this.init();
};

RoomListener.prototype = {
	init: function(){
		// on init, go ahead and start listening
	}
};

module.exports = RoomListener;