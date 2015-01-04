var _ = require("lodash"),
	async = require("async"),
	SocketStream = require("./SocketStream");

var RoomCacheReducer = function(options){
	this.options = _.defaults(options, {});

	this.init();
};

// RoomCacheReducer will create a Stream (either the cursor stream if there isn't enough data, or a median stream if there's more than enough data)
// and it will pipe that Stream to a RoomStream
RoomCacheReducer.prototype = {
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
	},
	init: function(){
		if(this.options.rangeName && this.ranges.hasOwnProperty(this.options.rangeName)){
			this.getDataLimitsForRange(
				this.ranges[this.options.rangeName], 
				function(err, cursor, range, minValue, maxValue){
					var stream,
						dest = new SocketStream(this.options.roomName, this.options.rangeName, this.options.socket);
					if(err || !minValue || !maxValue){
						stream = cursor.stream();
					} else {
						stream = this.getMedianStream(cursor, range, minValue, maxValue);	
					}			
					stream.pipe(dest);
				}.bind(this)
			)
		}
	},
	/*
	* returns a mongodb query object literal for a range
	*/
	getRangeQuery: function(range){
		var minQuery = {}, maxQuery = {};

		minQuery[range.field] = { $gte: range.begin() };
		maxQuery[range.field] = { $lte: range.end() };

		return {$and: [minQuery, maxQuery]};
	},
	/*
	* returns a mongodb Cursor object
	*/
	getDBCursorForRange: function(range){
		return this.options.collection.find( this.getRangeQuery(range) );
	},
	/*
	this function determines the data min and max values for a given range, 
	which along with the cursor object, are passed along to finalCallback
	finalCallback(err, cursor, minValue, maxValue)
	*/
	getDataLimitsForRange: function(range, finalCallback){
		var rangeCursor = this.getDBCursorForRange(range);

		async.waterfall([
			/*  get the count */
			function(cb){
				rangeCursor.count(false, function(err, count){
					cb(err, rangeCursor, count);
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
			/* then get the max value */
			function(cursor, minValue, cb){
				var descSort = {}, maxValue;

				descSort[range.field] = -1;

				cursor.sort(descSort).limit(1).toArray(function(err, items){
					cb(err, rangeCursor, minValue, items.length ? items[0][range.field] : null);
				}.bind(this));
			}.bind(this),
		], finalCallback);
	},
	/* 
	* takes a mongodb cursor and returns a stream of the median values
	*/
	getMedianStream: function(err, cursor, range, minValue, maxValue){
		var dataRange = maxValue - minValue,
			ascSort = {},
			medianPointInterval = dataRange / range.size-1,
			medianPointIndex = 0,
			diff, iDiff,
			curr, prev,
			cursorStream,
			outputStream = require("stream").transform();

		var setMedianPoint = function(){
			// setup values needed
			medianPoint = minValue + medianPointInterval*medianPointIndex;
			iDiff = Infinity;
		};

		setMedianPoint();

		ascSort[range.field] = 1;
		cursorStream = cursor.sort(ascSort).stream();

		cursorStream.on("data", function(data){
			// comparator function
			iDiff = Math.abs(medianPoint - data[range.field]);
			if(iDiff > diff){
				// prev is our closest point
				outputStream.write(prev);
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

		cursorStream.on("end", function(){
			// if we've arrived at the end of the stream and still haven't found all of our matching points
			// then send in the last item we have from the stream
			if(medianPointIndex < range.size-1){
				outputStream.write(prev);
			}
		});

		return outputStream;
	}};

module.exports = RoomCacheReducer;