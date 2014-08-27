var Room = require("./Room"),
	_ = require("lodash");

var IntervalRoom = function(io, options){
	options = _.defaults(options, {
		interval: 10 * 1000,
		cacheInterval: 60 * 1000 * 15
	});

	this.superType.apply(this, arguments);
};

IntervalRoom.prototype = _.create(Room.prototype, {
	constructor: IntervalRoom,
	superType: Room,
	on_active: function(){
		if(this.timer){
			clearInterval(this.timer);
			this.timer = null;
			this.activeLoop();
		} 	
		this.timer = setInterval(this.activeLoop.bind(this), this.options.interval);
	},
	on_empty: function(){		
		if(this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}
		this.timer = setInterval(this.emptyLoop.bind(this), this.options.cacheInterval);
	},
	activeLoop: function(){
		if(typeof this.options.on_activeLoop === "function"){
			this.options.on_activeLoop.call(this);
		}
	},
	emptyLoop: function(){
		if(typeof this.options.on_emptyLoop === "function"){
			this.options.on_emptyLoop.call(this);
		}
	}
});

module.exports = IntervalRoom;