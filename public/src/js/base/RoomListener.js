module.exports = function(app){
	
	var RoomListener = function(options){
		this.options = options;
		this.init();
	};

	RoomListener.prototype = {
		init: function(){
			// on init, go ahead and start listening
			console.log(app.socket);
			app.socket.emit("joinRoom", {
				room: this.options.room
			});
		},
		stop: function(){
			app.socket.emit("leaveRoom", {
				room: this.options.room
			});
		}
	};

	return RoomListener;
};