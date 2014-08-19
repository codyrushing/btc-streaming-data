var Room = require("./Room"),
	_ = require("lodash");

var IntervalRoom = function(io, options){
	this.superType.apply(this, arguments);
};

IntervalRoom.prototype = _.create(Room.prototype, {
	constructor: IntervalRoom,
	superType: Room,
	intervalDuration: 10 * 1000,
	emptyDuration: 60 * 1000 * 15,
	on_active: function(){
		if(this.interval) {
			// this is breaking the loop
			clearInterval(this.interval);
		} else {
			this.loop();
			this.interval = setInterval(this.loop.bind(this), this.intervalDuration);			
		} 
	},
	on_empty: function(){		
		if(this.interval) clearInterval(this.interval);		
		// do empty stuff
	},
	loop: function(){
		// do something
		if(typeof this.options.on_loop === "function"){
			this.options.on_loop.call(this);
		}
	}
});

module.exports = IntervalRoom;