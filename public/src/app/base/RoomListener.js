var socket = require("../socket"),
	AppDispatcher = require("../dispatcher"),
	moment = require("moment");

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
				// so parse dates here to get proper Moment object
				if(data.date){
					data.date = moment(data.date);
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
