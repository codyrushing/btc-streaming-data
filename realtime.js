var fs = require("fs"),
	Room = require("./rooms/constructor");
module.exports = (function(){
	var realtime = {
		init: function(httpServer){
			this.io = require("socket.io")(httpServer);
			this.io.on("connection", function(socket){
				console.log("%s connected", socket.id);
			});
			this.buildRooms();
			return this;
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