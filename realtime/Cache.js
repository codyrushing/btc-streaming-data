var medianRange = require("../util/medianRange");

var RoomCache = function(dispatcher, db, options){
	this.dispatcher = dispatcher;
	this.db = db;

	this.options = options;

	this.init();
};

RoomCache.prototype = {
	init: function(){
		this.dispatcher.on("data:" + this.options.name)
	}
};

module.exports = RoomCache;