var fs = require("fs"),
	EventEmitter = require("events").EventEmitter,
	Room = require("./Room");

module.exports = (function(){
	var realtime = {
		init: function(httpServer, db){
			this.io = require("socket.io")(httpServer);
			this.buildRooms(db);
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
			var self = this,
				dispatcher = new EventEmitter();

			// build rooms
			this.rooms = {};
			require("./rooms").forEach(function(name, i){	
				self.rooms[name] = require("./rooms/" + name)(name, dispatcher, self.io, db);
			});

			// build caches
			require("./caches").forEach(function(name, i){	
				require("./caches/" + name)(name, dispatcher, db);
			});

		}
	};
	return realtime.init.bind(realtime);
})();