var RoomCache = function(dispatcher, db, options){
	this.dispatcher = dispatcher;
	this.db = db;

	this.options = options;

	this.init();

};

RoomCache.prototype = {
	init: function(){
		this.collection = this.db.collection(this.options.name);
		this.dispatcher.on("data:"+this.options.name, this.ondata.bind(this));
	},
	ondata: function(data){
		this.collection.insert(data, function(err, result){
			if(!err){
				console.log("inserted record successfully");
			}
		});
	}
};

module.exports = RoomCache;