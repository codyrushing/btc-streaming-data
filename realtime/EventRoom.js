var Room = require("./Room");

var EventRoom = function(options){
	this.superType.apply(this, this.arguments);
};

EventRoom.prototype = _.create(Room.prototype, {
	constructor: EventRoom,
	superType: Room,
	interval: 1,
	hasListeners: function(){

	},
	isEmpty: function(){
		
	}
});

return EventRoom;