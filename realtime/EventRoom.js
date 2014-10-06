var Room = require("./Room"),
	_ = require("lodash");

var EventRoom = function(dispatcher, io, options){
	options = _.defaults(options, {

	});
	this.superType.apply(this, arguments);
};

EventRoom.prototype = _.create(Room.prototype, {
	constructor: EventRoom,
	superType: Room,
	on_active: function(){
		this.startListening();
	},
	on_empty: function(){
		this.stopListening();
	},
	startListening: function(){
		if(typeof this.options.startListening === "function"){
			this.options.startListening.call(this);
		}
	},
	stopListening: function(){
		if(typeof this.options.stopListening === "function"){
			this.options.stopListening.call(this);
		}
	}
});

module.exports = EventRoom;