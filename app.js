var http = require("http"),
	finalhandler = require("finalhandler"),
	serveStatic = require("serve-static")("public"),
	port = process.env.PORT || 3000,
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
server.listen(port, "localhost", function(){
	console.log("up and running on port %s", port);
});