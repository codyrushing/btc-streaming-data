"use strict";
var _ = require("lodash"),
	React = require("react"),
	Router = require("react-router"),
	routes = require("./routes");

var moment = require("moment");

window.moment = moment;

// this should work, but it doesn"t due to a bug with Moment
moment.locale("en", _.defaultsDeep({
			relativeTime: {
				future : "in %s",
		        past   : "%s ago",
		        s  : "a few secs",
		        m  : "a min",
		        mm : "%d min",
		        h  : "an hr",
		        hh : "%d hrs",
		        d  : "a day",
		        dd : "%d days",
		        M  : "a month",
		        MM : "%d months",
		        y  : "a year",
		        yy : "%d years"			}
		}
	)
);

// initializes websocket connection via socket.io
require("./socket");

// DEV ONLY - REMOVE THIS IN PRODUCTION
window.React = React;

var app = {
	init: function(){
		// defined here because it needs access to our app object
		var w = parseInt("20")
		document.addEventListener("DOMContentLoaded", this.domReady.bind(this))
		return this;
	},
	domReady: function(){
		require("./routes")(document.body)
		// this.bindEvents(document);
		// this.appNavigate(window.location.pathname, false, true);
	}
};

module.exports = app.init();
