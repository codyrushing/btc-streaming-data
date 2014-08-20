var Room = require("./Room"),
	_ = require("lodash");

var IntervalRoom = function(io, options){
	this.superType.apply(this, arguments);
};

IntervalRoom.prototype = _.create(Room.prototype, {
	constructor: IntervalRoom,
	superType: Room,
	on_active: function(){
		if(this.timer) {
			// this is breaking the loop
			clearInterval(this.interval);
		} else {
			this.loop();
			this.timer = setInterval(this.loop.bind(this), this.interval);			
		} 
	},
	on_empty: function(){		
		if(this.timer) clearInterval(this.timer);		
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