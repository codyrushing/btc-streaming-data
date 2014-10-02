var fs = require("fs"),
	Room = require("./Room");

module.exports = (function(){
	var realtime = {
		init: function(httpServer, db){
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
			socket.on("disconnect", function(data){
				// make sure all rooms know that this socket has disconnected
				socket.rooms.forEach(function(roomName, i){
					var room;
					if(self.rooms.hasOwnProperty(roomName)){
						room = self.rooms[roomName];
						room.on_leave.call(room, socket);
					}
				});
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
			}
		},
		buildRooms: function(db){
			var self = this;
			this.rooms = {};
			require("./rooms").forEach(function(file, i){	
				self.rooms[file] = require("./rooms/" + file)(self.io, db);
			});
		}
	};
	return realtime.init.bind(realtime);
})();