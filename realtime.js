module.exports = (function(){
	var realtime = {
		init: function(httpServer){
			this.io = require("socket.io")(httpServer);
			this.io.on("connection", function(socket){
				console.log("%s connected", socket.id);
			});
			this.buildRooms();
		},
		buildRooms: function(){

		}
	};
	return realtime.init.bind(realtime);
})();