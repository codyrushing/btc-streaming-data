var _ = require("lodash"),
	RoomCacheReducer = require("./RoomCacheReducer");

var RoomCache = function(dispatcher, db, options){
	this.dispatcher = dispatcher;
	this.db = db;
	this.options = _.defaults(options, {});

	this.init();
};

RoomCache.prototype = {
	init: function(){
		this.collection = this.db.collection(this.options.name);
		this.dispatcher.on("join:"+this.options.name, this.on_join.bind(this));
		this.dispatcher.on("data:"+this.options.name, this.on_data.bind(this));
	},
	on_data: function(data){
		this.collection.insert(data, function(err, result){
			if(err) { console.log(err); }
			this.collection.find().count(function(err, count){
				if(err) return;
				// TODO, make this configurable or logic-driven
				if(count >= 1000) {
					this.prune();
				}
			}.bind(this));
		}.bind(this));
	},
	on_join: function(data, socket){
		if(data.cacheRange){
			new RoomCacheReducer({
				collection: this.collection,
				rangeName: data.cacheRange,
				roomName: this.options.name,
				socket: socket
			});
		}
	},
	prune: function(){
		var self = this,
			pruneRange = function(range){
				this.getDBCursorForRange(range, function(){
					// TODO, do something here... no actual pruning is happening
				});
			};

		if(this.options.ranges){
			Object.keys(this.options.ranges).forEach(function(range, i){
				pruneRange.call(this, this.options.ranges[range]);
			}.bind(this));
		}
	}
};

module.exports = RoomCache;
