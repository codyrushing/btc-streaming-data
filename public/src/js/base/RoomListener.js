module.exports = function(app){
	
	var RoomListener = function(options){
		this.options = options;
		this.init();
	};

	RoomListener.prototype = {
		init: function(){
			// on init, go ahead and start listening
			app.socket.emit("joinRoom", {
				room: this.options.room
			});
			app.socket.on("data", function(data){

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