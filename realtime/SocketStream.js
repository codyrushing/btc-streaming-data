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

SocketStream.prototype._transform = function(data, encoding, done){
	var eventNames = ["data", this.roomName];
	if(this.rangeName){
		eventNames.push(this.rangeName);
	}
	console.log("streaming data to socket from date %s", data.date);
	this.socket.emit(eventNames.join(":"), data);
	done();
};

module.exports = SocketStream;