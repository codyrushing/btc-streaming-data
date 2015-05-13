"use strict";
var io = require("socket.io-client"),
	EventEmitter2 = require("eventemitter2").EventEmitter2,
	React = require("react"),
	Router = require("react-router"),
	routes = require("./routes");

var pageView = require("./views/page");

// DEV ONLY - REMOVE THIS IN PRODUCTION
window.React = React;

var app = {
	init: function(){
		// defined here because it needs access to our app object
		this.dispatcher = new EventEmitter2();
		this.socketConnect();
		document.addEventListener("DOMContentLoaded", this.domReady.bind(this))
		return this;
	},
	socketConnect: function(){
		this.fullHost = window.location.protocol + "//" + window.location.host;
		this.socket = io(this.fullHost);
	},
	domReady: function(){

		Router.run(routes, Router.HistoryLocation, function(Handler){
			/* <Handler /> doesn't get jsx transcoded properly, or maybe there's something wrong with gulp, hard to say */
			React.render(React.createElement(Handler, null),document.body);
		});

		// this.bindEvents(document);
		// this.appNavigate(window.location.pathname, false, true);
	}
};

module.exports = app.init();
