var http = require("http"),
	finalhandler = require("finalhandler"),
	serveStatic = require("serve-static")("public"),
	server;

/*
* Connect to database
* remove if not needed
*/
//require("./db-connect").connect(config);

/* 
* main request handler
*/
server = http.createServer(function(req, res){
	var done = finalhandler(req, res);
	serveStatic(req, res, done);
});

require("./realtime")(server);

/* 
* Start listening 
*/
server.listen(process.env.PORT || 3000, "localhost", function(){
	console.log("up and running");
});