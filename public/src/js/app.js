"use strict";
var io = require("socket.io-client"),
	$ = require("jquery"),
	_ = require("backbone/node_modules/underscore"),
	React = require("react"),
	Backbone = require("backbone"),
	pageView = require("./views/page"),
	Router;

Backbone.$ = $;

var app = {
	init: function(){
		// defined here because it needs access to our app object
		Router = require("./base/Router")(app);
		this.socketConnect();
		this.initRouter();
		$(this.domReady.bind(this));
	},
	socketConnect: function(){
		this.fullHost = window.location.protocol + "//" + window.location.host;
		this.socket = io(this.fullHost);
	},
	domReady: function(){
		React.renderComponent(pageView(null), document.getElementsByTagName("body")[0]);
		Backbone.history.start({
			pushState: true,
			hashChange: false
		});
		this.bindEvents($(document));
	},
	bindEvents: function(root){
		root.on("click", "a[href^='/'], a[href^='#'] a[href^='"+this.fullHost+"']", function(e) {
			if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
				e.preventDefault();
				var hostRe = new RegExp("^"+this.fullHost),
					link = $(e.currentTarget),
					route = link.attr("href")
						.replace(hostRe, "")
						.replace(/^\//, "")
						.replace(/^#/, "");
				this.appNavigate(route, link.attr("role") === "back");
			}
		}.bind(this));
	},
	appNavigate: function(route, reverse){
		this.router.trigger("navigate:before", {
			route: route,
			reverse: reverse
		});
		this.router.navigate(route, { trigger: true });
	},
	initRouter: function(){
		this.router = new Router();
		//_.extend(this.router, Backbone.Events);
	}
};

app.init();