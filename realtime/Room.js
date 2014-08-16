var Room = function(io, options){
	this.io = io;
	this.options = options;

	this.init();
};

Room.prototype = {
	init: function(){
		this.io.sockets.in(this.options.roomName)
			.on("join", this.on_join.bind(this))
			.on("leave", this.on_join.bind(this));

		this.updateRoomStatus();
	},
	// called only when client emits custom "joinRoom" event
	on_join: function(data, socket){
		this.updateRoomStatus();
	},
	// called only when client emits custom "joinRoom" event
	on_leave: function(data, socket){
		this.updateRoomStatus();
	},
	updateRoomStatus: function(){
		this.getNumberOfListeners() ? this.hasListeners() : this.isEmpty();
	},
	on_data: function(data){
		this.updateRoomStatus();
		if(!this.getNumberOfListeners()) return;
		console.log("emitting data");
		console.log(data);
		this.io.sockets.in(this.options.roomName).emit("data", data);
	},
	getNumberOfListeners: function(){
		return this.io.sockets.in(this.options.roomName).sockets.length;
	}
};

module.exports = Room;