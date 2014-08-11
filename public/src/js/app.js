"use strict";
var io = require("socket.io-client"),
	$ = require("jquery"),
	_ = require("backbone/node_modules/underscore"),
	Backbone = require("backbone"),
	Router = require("./base/router");

Backbone.$ = $;

var app = {
	init: function(){
		this.initRouter();
		$(this.domReady.bind(this));
	},
	domReady: function(){
		Backbone.history.start({
			pushState: true,
			hashChange: false
		});		
		this.bindEvents($(document));
	},
	bindEvents: function(root){
		var fullHost = window.location.protocol + "//" + window.location.hostname,
			body = $("body");

		root.on("click", "a[href^='/'], a[href^='#'] a[href^='"+fullHost+"']", function(e) {
			if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
				e.preventDefault();
				var hostRe = new RegExp("^"+fullHost),
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