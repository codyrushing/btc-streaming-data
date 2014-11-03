var mongo = require("mongodb"),
	async = require("async"),
	_ = require("lodash"),
	RoomStream = require("./RoomStream");

var RoomCache = function(dispatcher, db, options){
	this.dispatcher = dispatcher;
	this.db = db;

	this.options = _.defaults(options, {
		ranges: {
			lastHour: {
				field: "date",
				size: 10,
				begin: function(){
					return new Date(new Date().getTime() - 1000 * 60 * 60);
				},
				end: function(){
					return new Date(new Date().getTime());
				}				
			},
			lastDay: {
				field: "date",
				size: 10,
				begin: function(){
					return new Date(new Date().getTime() - 1000 * 60 * 60 * 24);
				},
				end: function(){
					return new Date(new Date().getTime());
				}				
			},
			last7Days: {
				field: "date",
				size: 10,
				begin: function(){
					return new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7);
				},
				end: function(){
					return new Date(new Date().getTime());
				}				
			},
			last30Days: {
				field: "date",
				size: 10,
				begin: function(){
					return new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30);
				},
				end: function(){
					return new Date(new Date().getTime());
				}
			},
			last180Days: {
				field: "date",
				size: 10,
				begin: function(){
					return new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 180);
				},
				end: function(){
					return new Date(new Date().getTime());
				}
			},
			last180Days: {
				field: "date",
				size: 10,
				begin: function(){
					return new Date(0);
				},
				end: function(){
					return new Date(new Date().getTime());
				}
			}
		}
	});

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
	on_join: function(socket){
		if(socket.cacheRange && this.options.ranges[socket.cacheRange]){
			// fetch a stream object
			this.getMedianDBCursorForRange(this.options.ranges[socket.cacheRange], function(err, cursor, minValue, maxValue){

			});
		}
	},
	getRangeQuery: function(range){
		var minQuery = {}, maxQuery = {};

		minQuery[range.field] = { $gte: range.begin() };
		maxQuery[range.field] = { $lte: range.end() };

		return {$and: [minQuery, maxQuery]};
	},
	getDBCursorForRange: function(range){
		return this.collection.find( this.getRangeQuery(range) );
	},
	/*
	accepts a callback whose signature is (err, cursor, minValue, maxValue)
	*/
	getMedianDBCursorForRange: function(range, finalCallback){
		var medianCursor = this.getDBCursorForRange(range);

		async.waterfall([
			/*  get the count */
			function(cb){
				medianCursor.count(false, function(err, count){
					cb(err, medianCursor, count);
				});
			}.bind(this),
			/* if count > range.size, then get the min value */
			/* else send the results to the final callback */
			function(cursor, count, cb){
				var ascSort;
				if(count && range.size && count > range.size){
					ascSort = {};
					ascSort[range.field] = 1;
					
					cursor.sort(ascSort).limit(1).toArray(function(err, items){
						cb(err, cursor.rewind(), items.length ? items[0][range.field] : null);
					});
				} else {
					cb("Not enough data in storage - no pruning necessary", cursor, null, null);
				}
			}.bind(this),
			/* then get the min value */
			function(cursor, minValue, cb){
				var descSort = {}, maxValue;

				descSort[range.field] = -1;

				cursor.sort(descSort).limit(1).toArray(function(err, items){
					cb(err, this.getDBCursorForRange(range), minValue, items.length ? items[0][range.field] : null);
				}.bind(this));
			}.bind(this),
		], finalCallback);
	},
	prune: function(){
		var self = this,
			pruneRange = function(range){
				this.getDBCursorForRange(range, function(){

				});
			};

		if(this.options.ranges){
			Object.keys(this.options.ranges).forEach(function(range, i){
				pruneRange.call(this, this.options.ranges[range]);
			}.bind(this));
		}
	},
	medianRangeFromCursor: function(cursor, range, minValue, maxValue){
		var dataRange = maxValue - minValue,
			ascSort = {},
			medianPointInterval = dataRange / range.size-1,
			medianPointIndex = 0,
			diff, iDiff,
			curr, prev,
			stream,
			roomStream = new RoomStream();

		var setMedianPoint = function(){
			// setup values needed
			medianPoint = minValue + medianPointInterval*medianPointIndex;
			iDiff = Infinity;
		};

		setMedianPoint();

		ascSort[range.field] = 1;
		stream = cursor.sort(ascSort).stream();

		stream.on("data", function(data){
			// comparator
			iDiff = Math.abs(medianPoint - data[range.field]);
			if(iDiff > diff){
				// prev is our closest point
				ws.write(prev);
				//this.dispatcher()

				medianPointIndex++;
				setMedianPoint();
			}

			// if(prev){
			// 	curr = data;

			// 	prev = data;
			// }
			prev = data;
			diff = iDiff;
		}.bind(this));

		stream.on("end", function(){
			// if we've arrived at the end of the stream and still haven't found all of our matching points
			// then send in the last item we have from the stream
			if(medianPointIndex < range.size-1){
				ws.write(prev);
			}
		}.bind(this));

		return ws;

	}
};

module.exports = RoomCache;