module.exports = function(app){
	
	var RoomListener = function(options){
		this.options = options;
		this.init();
	};

	RoomListener.prototype = {
		init: function(){
			// on init, go ahead and start listening
			app.socket.emit("joinRoom", {
				room: this.options.room,
				cacheRange: "lastHour"
			});
			app.socket.on("data", function(data){
				app.dispatcher.trigger("data", data);
			}.bind(this));
		},
		stop: function(){
			app.socket.emit("leaveRoom", {
				room: this.options.room
			});
		}
	};

	return RoomListener;
};