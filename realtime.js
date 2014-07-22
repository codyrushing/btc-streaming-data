module.exports = (function(){
	var realtime = {
		init: function(httpServer){
			this.io = require("socket.io")(httpServer);
			this.buildRooms();
		},
		buildRooms: function(){
			require("./rooms")(this.io);
		}
	};

	return realtime.init.bind(realtime);
})();