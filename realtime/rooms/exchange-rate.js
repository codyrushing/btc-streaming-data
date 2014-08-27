var IntervalRoom = require("../IntervalRoom"),
	blockchainRequest = require("../../util/blockchainRequest"),
	roomName = (function(){
		var arr = __filename.split("/");
		return arr[arr.length-1].split(".")[0];
	})();

var loop = function(){
	var self = this;

	blockchainRequest({
		url: "/ticker",
		success: function(res, body){
			self.on_data.call(self, JSON.parse(body));
		}
	});
};

module.exports = function(io){
	return new IntervalRoom(io, {
		roomName: roomName,
		interval: 30 * 1000,
		cacheInterval: 60 * 1000 * 15,
		on_activeLoop: loop,
		on_emptyLoop: loop
	});
};