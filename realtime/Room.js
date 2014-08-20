var _ = require("lodash");

var Room = function(io, options){
	this.io = io;

	this.options = _.defaults({
		cacheLength: 10
	}, options);

	this.init();
};

Room.prototype = {
	interval: 10 * 1000,
	cacheInterval: 60 * 1000 * 15,
	dataLength: 10,
	init: function(){
		this.initCache();
		this.io.sockets.in(this.options.roomName)
			.on("join", this.on_join.bind(this))
			.on("leave", this.on_join.bind(this));

		this.updateRoomStatus();
	},
	initCache: function(){
		this.cache = this.cache || [];
		// define max possible timeRange
		this.maxTimeRange = this.cacheInterval * this.dataLength;
		// define max possible # of items in cache (if all items are coming from shorter interval)
		this.maxCacheLength = Math.round(this.maxTimeRange / this.interval);
	},
	// called only when client emits custom "joinRoom" event
	on_join: function(data, socket){
		this.updateRoomStatus();
	},
	// called only when client emits custom "joinRoom" event
	on_leave: function(data, socket){
		this.updateRoomStatus();
	},
	updateRoomStatus: function(){
		if(this.getNumberOfListeners()){
			if(!this.active) this.on_active();
			this.active = true;
		} else {
			this.on_empty();
			this.active = false;
		}
		this.getNumberOfListeners() ? this.on_active() : this.on_empty();
	},
	on_data: function(data){
		if(!data.date){
			data.date = new Date();
		}
		this.cachePopulator(data);
		this.updateRoomStatus();
		if(!this.getNumberOfListeners()) return;
		console.log("emitting data");
		console.log(data);
		this.io.sockets.in(this.options.roomName).emit("data", data);
	},
	cachePopulator: function(data){
		// if we're at our limit, knock one off of the beginning
		if(this.cache.length === this.maxCacheLength) this.cache.shift();

		this.cache = _.sortBy(this.cache, function(item){
			return item.date;
		});
		if ( this.cache.length < this.options.dataLength ){
			this.cache.push(data);
		} else {
			// run logic using dates on these items
			this.cache = _.sortBy(this.cache, function(item){
				return item.date;
			});
			if (this.cache[0].date + this.)

		}
	},
	getNumberOfListeners: function(){		
		return this.io.sockets.in(this.options.roomName).sockets.length;
	}
};

module.exports = Room;