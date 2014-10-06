var _ = require("lodash"),
	RoomCache = require("./RoomCache");

var Room = function(dispatcher, io, options){
	this.dispatcher = dispatcher;
	this.io = io;

	this.options = _.defaults(options, {
		medianLength: 10
	});

	this.init();
};

Room.prototype = {
	init: function(){
		//this.initCache();
		this.io.sockets.in(this.options.name)
			.on("join", this.on_join.bind(this))
			.on("leave", this.on_join.bind(this));

		this.updateRoomStatus();
	},
	initCache: function(){
		this.cache = this.cache || [];
		this.medianRange = this.medianRange || [];
		// define max possible # of items in cache (if all items are coming from shorter interval)
		// cacheInterval * medianLength gives you the max date range that our cache needs to hold
		// divide that by the interval to get the max possible # of items to hold in the cache
		this.maxCacheLength = Math.round(this.options.cacheInterval * this.options.medianLength / this.options.interval);
	},
	// called only when client emits custom "joinRoom" event
	on_join: function(socket){
		this.updateRoomStatus();
		socket.emit("data", this.medianRange);
	},
	// called only when client emits custom "leave" event
	on_leave: function(socket){
		console.log("socket with id %s has left the room", socket.id);
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
		//this.getNumberOfListeners() ? this.on_active() : this.on_empty();
	},
	on_data: function(data){
		if(!data.date){
			data.date = new Date().getTime();
		}
		//this.cachePopulator(data);
		this.updateRoomStatus();
		if(!this.getNumberOfListeners()) return;
		this.io.sockets.in(this.options.name).emit("data", data);
		this.dispatcher.emit("data:"+this.options.name, data);
	},
	cachePopulator: function(data){
		// if we're at our limit, knock one off of the beginning
		if(this.cache.length === this.maxCacheLength) this.cache.shift();

		// add data
		this.cache.push(data);

		// get our medianRange (sent to new sockets when they join)
		// this.medianRange = medianRange(this.cache, this.options.medianLength, function(item){
		// 	return item.date.getTime();
		// });

	},
	getNumberOfListeners: function(){		
		return this.io.sockets.in(this.options.name).sockets.length;
	}
};

module.exports = Room;