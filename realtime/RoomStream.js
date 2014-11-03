var Transform = require("stream").Transform,
	inherits = require("util").inherits;

var RoomStream = function(options){
	options.objectMode = true;
	Transform.apply(this, arguments);
};

inherits(RoomStream, Transform);