var IntervalRoom = require("../IntervalRoom"),
	blockchainRequest = require("../../util/blockchainRequest");
	// roomName = (function(){
	// 	var arr = __filename.split("/");
	// 	return arr[arr.length-1].split(".")[0];
	// })();

var loop = function(){
	var self = this;

	blockchainRequest({
		url: "/ticker",
		success: function(res, body){
			this.on_data(JSON.parse(body));
		}.bind(this)
	});
};

module.exports = function(name, dispatcher, io){
	return new IntervalRoom(dispatcher, io, {
		name: name,
		interval: 10 * 1000,
		cacheInterval: 60 * 1000 * 15,
		on_activeLoop: loop,
		on_emptyLoop: loop
	});
};