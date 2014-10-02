var IntervalRoom = require("../IntervalRoom"),
	blockchainRequest = require("../../util/blockchainRequest"),
	roomName = (function(){
		var arr = __filename.split("/");
		return arr[arr.length-1].split(".")[0];
	})();

var loop = function(){
	blockchainRequest({
		url: "/stats?format=json",
		success: function(res, body){
			this.on_data(JSON.parse(body));
		}.bind(this)
	});
};

module.exports = function(io, db){
	return new IntervalRoom(io, db, {
		roomName: roomName,
		interval: 60 * 1000 * 15,
		cacheInterval: 60 * 1000 * 15,
		on_activeLoop: loop,
		on_emptyLoop: loop
	});
};