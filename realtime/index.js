var fs = require("fs"),
	Room = require("./Room");

module.exports = (function(){
	var realtime = {
		init: function(httpServer){
			this.io = require("socket.io")(httpServer);
			this.buildRooms();
			this.io.on("connection", this.on_connect.bind(this));
			return this;
		},
		on_connect: function(socket){
			var self = this;
			console.log("socket with id %s has connected", socket.id);
			socket.on("joinRoom", function(data){
				self.on_joinRoom.call(self, data, socket);
			});
			socket.on("leaveRoom", function(data){
				self.on_leaveRoom.call(self, data, socket);
			});
		},
		on_joinRoom: function(data, socket){
			if(data.room){
				socket.join(data.room);
				if(this.rooms && this.rooms.hasOwnProperty(data.room)){
					this.rooms[data.room].on_join(socket);
				}
				console.log("socket with id %s has joined this room", socket.id);
			}
		},
		on_leaveRoom: function(data, socket){
			if(data.room){
				socket.leave(data.room);
				self.io.sockets.to(data.room).emit("socketLeave");
			}
		},
		buildRooms: function(){
			var self = this;
			this.rooms = {};
			require("./rooms").forEach(function(file, i){	
				self.rooms[file] = require("./rooms/" + file)(self.io);
			});
		}
	};
	return realtime.init.bind(realtime);
})();