var _ = require("lodash");

var Room = function(io, options){
	this.io = io;

	this.options = _.defaults({
		cacheLength: 10
	}, options);

	this.init();
};

Room.prototype = {
	init: function(){
		this.io.sockets.in(this.options.roomName)
			.on("join", this.on_join.bind(this))
			.on("leave", this.on_join.bind(this));

		this.updateRoomStatus();
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
		// receives data and adds determines if it needs to add it to cache
		this.cache = this.cache || [];
		if ( this.cache.length < this.options.cacheLength ){
			this.cache.push(data);
		} else {
			// run logic using dates on these items
			var lastDate = _.last(this.cache).date;
		}
	},
	getNumberOfListeners: function(){		
		return this.io.sockets.in(this.options.roomName).sockets.length;
	}
};

module.exports = Room;