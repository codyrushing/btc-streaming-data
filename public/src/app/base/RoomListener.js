var socket = require("../socket"),
	AppDispatcher = require("../dispatcher");

var RoomListener = function(options){
	this.options = options;
	return this;
};

RoomListener.prototype = {
	init: function(){
		// on init, go ahead and start listening
		socket.emit("joinRoom", {
			room: this.options.room,
			cacheRange: "lastHour"
		});

		this.bindAllEvents();
	},
	bindAllEvents: function(){
		Object.keys(this.options.events).forEach(function(eventName){
			socket.on(eventName, function(data){
				// raw data coming from socket.io is in JSON, which has to stringify dates
				// so parse dates
				if(typeof data.date === "string"){
					data.date = new Date(data.date);
				}
				this.options.events[eventName](data);
			}.bind(this));
		}, this);
	},
	unbindAllEvents: function(){
		Object.keys(this.options.events).forEach(function(eventName){
			socket.off(eventName);
		});
	},
	destroy: function(){
		this.unbindAllEvents();
		socket.emit("leaveRoom", {
			room: this.options.room
		});
	}
};

module.exports = RoomListener;
