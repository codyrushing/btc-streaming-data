var http = require("http"),
	fs = require("fs"),
	finalhandler = require("finalhandler"),
	publicDir = "public",
	publicFilePath = __dirname + "/" + publicDir,	
	serveStatic = require("serve-static")(publicDir),
	port = process.env.PORT || 3000,
	server;

/* 
* main request handler
*/
server = http.createServer(function(req, res){
	// instead of 404ing unfound urls, serve them index.html so that the client side routing can take over
	fs.exists(publicFilePath + req.url, function(exists){
		if(!exists) req.url = "/index.html";
		serveStatic(req, res, finalhandler(req, res) );
	});
});

/*
* Connect to database
*/
require("./db-connect")(server);

/* 
* Start listening 
*/
server.listen(port, "localhost", function(){
	console.log("up and running on port %s", port);
});