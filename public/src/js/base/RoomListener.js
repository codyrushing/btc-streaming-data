var moment = require("moment");

var RoomListener = function(socket, dispatcher, options){
	this.socket = socket;
	this.dispatcher = dispatcher;
	this.options = options;
	this.init();
};

RoomListener.prototype = {
	init: function(){
		// on init, go ahead and start listening
		this.socket.emit("joinRoom", {
			room: this.options.room,
			cacheRange: "lastHour"
		});
		this.socket.on("data", function(data){
			// data coming from sockets is in JSON, which has to stringify dates
			// so parse dates here to get proper Moment object
			if(data.date){
				data.date = moment(data.date);
			}
			this.dispatcher.emit("data", data);
		}.bind(this));
	},
	exit: function(){
		this.socket.off("data");
		this.socket.emit("leaveRoom", {
			room: this.options.room
		});
	}
};

module.exports = RoomListener;