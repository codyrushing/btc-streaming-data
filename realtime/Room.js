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

		// add data
		this.cache.push(data);

		this.setRangeData();

	},
	setRangeData: function(){
		var i,
			medianPoint,
			targetDateInterval,
			initialDate,
			finalDate,
			prevIndex,
			diff,
			iDiff,
			rangeData = [];

		// sort by date
		this.cache = _.sortBy(this.cache, function(item){
			return item.date;
		});

		if(this.cache.length < this.dataLength){
			// if we have less than the desired # of data points, just return what we have
			rangeData = this.cache;
		} else {
			// get n number or representative data points			
			initialDate = this.cache[0].date.getTime();
			finalDate = this.cache[this.cache.length-1].date.getTime();
			prevIndex = this.cache.length-1;

			targetDateInterval = (finalDate - initialDate) / (this.dataLength+1);
			
			for (i=this.dataLength; i>0; i--){
				// define our median points
				medianPoint = (targetDateInterval * i) + initialDate;
				diff = Infinity;
				// loop through cache backwards, starting at prevIndex, finding the data point closest to our median point
				for(prevIndex; prevIndex>-1; prevIndex--){
					iDiff = Math.abs( medianPoint - this.cache[prevIndex].data.getTime() );
					if(iDiff > diff){
						// this means we have passed the closest item and are now getting further away from medianPoint
						// so it is safe to conclude that the previous item in the loop was our closest point
						rangeData.unshift(this.cache[prevIndex+1]);
						break;
					}
					diff = iDiff;
				}
			}
		}

		this.rangeData = rangeData;

	},
	getNumberOfListeners: function(){		
		return this.io.sockets.in(this.options.roomName).sockets.length;
	}
};

module.exports = Room;