var Room = require("./Room"),
	_ = require("lodash");

var IntervalRoom = function(io, options){
	this.superType.apply(this, arguments);
};

IntervalRoom.prototype = _.create(Room.prototype, {
	constructor: IntervalRoom,
	superType: Room,
	intervalDuration: 5000,
	emptyDuration: 60 * 1000 * 15,
	hasListeners: function(){
		this.interval = setInterval(this.loop.bind(this), this.intervalDuration);
	},
	isEmpty: function(){

	},
	loop: function(){
		// do something
		if(typeof this.options.on_loop === "function"){
			this.options.on_loop.call(this);
		}
	}
});

module.exports = IntervalRoom;