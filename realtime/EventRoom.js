var Room = require("./Room");

var EventRoom = function(){
	this.superType.apply(this, this.arguments);
};

EventRoom.prototype = _.create(Room.prototype, {
	constructor: EventRoom,
	superType: Room,
	hasListeners: function(){

	},
	isEmpty: function(){
		
	}
});

return EventRoom;