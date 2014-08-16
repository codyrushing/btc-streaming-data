var request = require("request"),
	IntervalRoom = require("../IntervalRoom");

module.exports = function(io){
	return new IntervalRoom(io, {
		roomName: "exchange-rate",
		on_loop: function(){
			var self = this;
			request("https://blockchain.info/ticker?api_code={{APICODE}}", function (err, res, body) {
				if (!err && res.statusCode == 200) {
					self.on_data.call(self, body);
				}
			});
		}
	});
};