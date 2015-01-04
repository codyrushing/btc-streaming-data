var _ = require("lodash"),
	Transform = require("stream").Transform,
	inherits = require("util").inherits;

// this streams data to socket(s)
var SocketStream = function(roomName, rangeName, socket, options){
	options = _.defaults(options || {}, {
		objectMode: true
	});
	this.socket = socket;
	this.roomName = roomName;
	this.rangeName = rangeName;
	Transform.apply(this, [options]);
};

inherits(SocketStream, Transform);

SocketStream.prototype._transform = function(data, encoding, callback){
	// data comes through here
	var eventNames = ["data", this.roomName];
	if(this.rangeName){
		eventNames.push(this.rangeName);
	}
	this.socket.emit(eventNames.join(":"), data);
};

module.exports = SocketStream;