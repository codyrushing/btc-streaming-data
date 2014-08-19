var request = require("request"),
	IntervalRoom = require("../IntervalRoom"),
	roomName = (function(){
		var arr = __filename.split("/");
		return arr[arr.length-1].split(".")[0];
	})();

module.exports = function(io){
	return new IntervalRoom(io, {
		roomName: roomName,
		on_loop: function(){
			var self = this;
			console.log("loop");
			request({ url: "https://blockchain.info/ticker", qs: { api_code: process.env.BLOCKCHAIN_API_CODE } }, function (err, res, body) {
				if (!err && res.statusCode == 200) {
					self.on_data.call(self, body);
				}
			});
		}
	});
};