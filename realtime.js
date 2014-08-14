var fs = require("fs"),
	Room = require("./rooms/constructor");

module.exports = (function(){
	var realtime = {
		init: function(httpServer){
			this.io = require("socket.io")(httpServer);
			this.io.on("connection", this.on_connect.bind(this));
			this.buildRooms();
			return this;
		},
		on_connect: function(socket){
			var self = this;
			console.log("socket with id %s has connected", socket.id);
			socket.on("joinRoom", function(data){
				if(data.room){
					socket.join(data.room);
					self.io.sockets.in(data.room).emit("join");
				}
			});
			socket.on("leaveRoom", function(data){
				if(data.room){
					socket.leave(data.room);
					self.io.sockets.in(data.room).emit("leave");
				}
			});
		},
		buildRooms: function(){
			var self = this;
			require("./public/src/js/rooms.js").forEach(function(file, i){
				new Room(self.io, require("./rooms/" + file));
			});
		}
	};
	return realtime.init.bind(realtime);
})();