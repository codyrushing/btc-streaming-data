var request = require("request");

module.exports = function(options){
	request({ url: "https://blockchain.info" + options.url, qs: { api_code: process.env.BLOCKCHAIN_API_CODE } }, function (err, res, body) {
		if (!err && res.statusCode == 200) {
			options.success(res, body);
		} else if(typeof options.error === "function"){
			options.error(res, err);
		} else {
			console.log(err);
		}
	});
};