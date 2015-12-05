"use strict";

var _ = require("lodash"),
	React = require("react"),
	Router = require("react-router"),
	routes = require("./routes");

var moment = require("moment");

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
		        yy : "%d years"
			}
		}
	)
);

// DEV ONLY - REMOVE THIS IN PRODUCTION
window.React = React;

class App {
	constructor() {
		this.init();
		return this;
	}
	init(){
		require("app/socket.js");
		document.addEventListener("DOMContentLoaded", this.domReady.bind(this))
		return this;
	}
	domReady(){
		require("app/routes")(document.querySelectorAll(".app-wrapper")[0])
	}
};

module.exports = new App();
