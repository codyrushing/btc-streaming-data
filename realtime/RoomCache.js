var RoomCache = function(dispatcher, db, options){
	this.dispatcher = dispatcher;
	this.db = db;

	this.options = options;

	this.init();

};

RoomCache.prototype = {
	init: function(){
		this.dispatcher.on("data:"+this.options.name, function(data){
			console.log("cache received a data event with:");
			console.log(data);
		});
	}
};

module.exports = RoomCache;