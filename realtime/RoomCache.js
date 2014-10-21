var mongo = require("mongodb"),
	async = require("async"),
	_ = require("lodash");

var RoomCache = function(dispatcher, db, options){
	this.dispatcher = dispatcher;
	this.db = db;

	this.options = _.defaults(options, {
		ranges: [
			{
				name: "lastHour",
				field: "date",
				size: 10,
				begin: function(){
					return new Date().getTime() - 1000 * 60 * 60;
				},
				end: function(){
					return new Date().getTime();
				}
			},
			{
				name: "lastDay",
				field: "date",
				size: 10,
				begin: function(){
					return new Date().getTime() - 1000 * 60 * 60 * 24;
				},
				end: function(){
					return new Date().getTime();
				}
			},
			{
				name: "last7Days",
				field: "date",
				size: 10,
				begin: function(){
					return new Date().getTime() - 1000 * 60 * 60 * 24 * 7;
				},
				end: function(){
					return new Date().getTime();
				}
			},
			{
				name: "last30Days",
				field: "date",
				size: 10,
				begin: function(){
					return new Date().getTime() - 1000 * 60 * 60 * 24 * 30;
				},
				end: function(){
					return new Date().getTime();
				}
			},
			{
				name: "last180Days",
				field: "date",
				size: 10,
				begin: function(){
					return new Date().getTime() - 1000 * 60 * 60 * 24 * 180;
				},
				end: function(){
					return new Date().getTime();
				}
			},
			{
				name: "last180Days",
				field: "date",
				size: 10,
				begin: function(){
					return 0;
				},
				end: function(){
					return new Date().getTime();
				}
			}
		]
	});

	this.init();

};

RoomCache.prototype = {
	init: function(){
		this.collection = this.db.collection(this.options.name);
		this.dispatcher.on("data:"+this.options.name, this.ondata.bind(this));
	},
	ondata: function(data){
		this.collection.insert(data, function(err, result){
			if(err) { console.log(err); }
			else {
				// replace date with NumberInt (mongodb will make them floats by default)
				// this.collection.update(
				// 	{_id: result._id}, {
				// 	$set: {date: new mongo.NumberInt(result.date)}
				// 	},
				// 	function(error, r){
				// 		if(error){
				// 			console.log(error);
				// 		} else {
				// 			console.log("updated date successfully");
				// 		}
				// 	}
				// );
			}
		}.bind(this));
		this.prune();
	},
	prune: function(cb){

		var self = this,
			pruneRange = function(range){

				async.waterfall([
					function(cb){
						var minQuery = {}, maxQuery = {}, 
							baseQuery;

						minQuery[range.field] = { $gte: range.begin() };
						maxQuery[range.field] = { $lte: range.end() };

						// find all items in our range
						baseQuery = this.collection.find({$and: [minQuery, maxQuery]});

						baseQuery.count(false, function(err, count){
							cb(err, baseQuery, count);
						});

					}.bind(this),
					function(baseQuery, count, cb){
						var ascSort;
						if(count && range.size && count > range.size){
							ascSort = {};
							ascSort[range.field] = 1;
							
							baseQuery.sort(ascSort).limit(1).toArray(function(err, items){
								cb(err, baseQuery.rewind(), items[0][range.field]);
							});
						} else {
							cb("Not enough data in storage - no pruning necessary");
						}
					},
					function(baseQuery, minValue, cb){
						var descSort = {}, maxValue;

						descSort[range.field] = -1;

						baseQuery.sort(descSort).limit(1).toArray(function(err, items){
							cb(err, baseQuery.rewind(), minValue, items[0][range.field]);
						});
					},
					function(baseQuery, minValue, maxValue, cb){
						var dataRange = maxValue - minValue,
							pointInterval = dataRange / range.size-1,
							i,
							stream = baseQuery.stream();

						stream.on("data", function(data){
							console.log(data);
						});
						stream.on("end", function(){
							// done
							cb();
						});
					}
				], function(err, result){
					// MAIN CALLBACK
					console.log("DONE");
				});

			};

		if(this.options.ranges && this.options.ranges.length){
			this.options.ranges.forEach(pruneRange.bind(self));
		}

	}
};

module.exports = RoomCache;