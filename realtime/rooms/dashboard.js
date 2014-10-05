var IntervalRoom = require("../IntervalRoom"),
	blockchainRequest = require("../../util/blockchainRequest");

var loop = function(){
	blockchainRequest({
		url: "/stats?format=json",
		success: function(res, body){
			this.on_data(JSON.parse(body));
		}.bind(this)
	});
};

module.exports = function(name, dispatcher, io){
	return new IntervalRoom(dispatcher, io, {
		name: name,
		interval: 60 * 1000 * 15,
		cacheInterval: 60 * 1000 * 15,
		on_activeLoop: loop,
		on_emptyLoop: loop
	});
};