var EventRoom = require("../EventRoom"),
	WebSocket = require("ws"),
	ws;

module.exports = function(name, dispatcher, io){
	return new EventRoom(dispatcher, io, {
		name: name,
		startListening: function(){
			var self = this;
			ws = new WebSocket("wss://ws.blockchain.info/inv");
			ws.on("open", function(){
				ws.send('{"op":"unconfirmed_sub"}');
				ws.on("message", function(message){
					self.on_data(JSON.parse(message));
				});
			});
		},
		stopListening: function(){
			if(ws){
				ws.close();
			}			
		} 
	});
};