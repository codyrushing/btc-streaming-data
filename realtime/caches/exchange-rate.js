var RoomCache = require("../RoomCache");

module.exports = function(name, dispatcher, db){
	return new RoomCache(dispatcher, db, {
		name: name
	});
};