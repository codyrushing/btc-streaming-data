var mongodb = require("mongodb"),
	config = require("./config"),
	connectArr = [];

module.exports = function(server){
	connectArr.push("mongodb://");
	if(config.dbUser){
		connectArr.push(config.dbUser);
		connectArr.push("@");
	}
	if(config.dbPwd){
		connectArr.push(config.dbPwd);
	}
	connectArr.push(config.db);

	mongodb.MongoClient.connect(connectArr.join(""), function(err, db){
		if(err) {
			console.log("error connecting to mongo");
		} else {
			console.log("connected to %s successfully", db.databaseName);
			require("./realtime")(server, db);
		}
	});	
};