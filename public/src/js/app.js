"use strict";
var io = require("socket.io-client"),
	$ = require("jquery"),
	EventEmitter2 = require("eventemitter2").EventEmitter2,
	React = require("react"),
	pageView = require("./views/page");

// DEV ONLY - REMOVE THIS IN PRODUCTION
window.React = React;

var app = {
	init: function(){
		// defined here because it needs access to our app object
		this.dispatcher = new EventEmitter2();
		this.socketConnect();
		$(this.domReady.bind(this));
		return this;
	},
	supports: {
		history: (window.history && window.history.pushState)
	},
	socketConnect: function(){
		this.fullHost = window.location.protocol + "//" + window.location.host;
		this.socket = io(this.fullHost);
	},
	domReady: function(){
		React.renderComponent(
			pageView({dispatcher: this.dispatcher, socket: this.socket}),
			document.body
    	);

		this.bindEvents(document);
		this.appNavigate(window.location.pathname, false, true);
	},
	bindEvents: function(root){
		if(this.supports.history){
	
			$(root).on("click", "a[href^='/'], a[href^='#'] a[href^='"+this.fullHost+"']", function(e) {
				if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
					e.preventDefault();
					var hostRe = new RegExp("^"+this.fullHost),
						link = $(e.currentTarget),
						route = link.attr("href")
							.replace(hostRe, "")
							//.replace(/^\//, "")
							.replace(/^#/, "");
					this.appNavigate(route, link.attr("role") === "back");
				}
			}.bind(this));

			// back or forward buttons
			$(window).on("popstate", function(e){
				this.dispatcher.emit("route", window.location.pathname);
			}.bind(this));

		}
	},
	appNavigate: function(route, reverse, replace){		
		if(reverse){
			window.history.go(-1);
		} else {
			replace
				? window.history.replaceState(null, null, route)
				: window.history.pushState(null, null, route);
			this.dispatcher.emit("route", route, false);
		}
	}
};

module.exports = app.init();