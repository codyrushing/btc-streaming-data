var _ = require("backbone/node_modules/underscore"),
	React = require("react"),
	Backbone = require("backbone"),
	RoomListener;

module.exports = function(app){
	console.log(app);
	return Backbone.Router.extend({
		routes: {
			"": "home",
			"exchange-rate": "exchangeRate"
		},
		initialize: function(){
			//_.bindAll(this); // this is the way lodash would do it
			RoomListener = require("./RoomListener")(app);
			this.on("route", this.on_route);
			this.on("navigate:before", this.on_beforeNavigate);
		},
		on_route: function(route){
			console.log("route happened");
			console.log(route);
		},
		on_beforeNavigate: function(){

		},
		home: function(route){
			var dashboardListener = new RoomListener({
				room: "dashboard"
			});
		},
		exchangeRate: function(route){
			var exchangeRateListener = new RoomListener({
				room: "exchange-rate"
			});
		}
	});
};