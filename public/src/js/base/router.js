var _ = require("backbone/node_modules/underscore"),
	React = require("react"),
	Backbone = require("backbone"),
	RoomListener;

module.exports = function(app){
	console.log(app);
	return Backbone.Router.extend({
		routes: {
			"": "home",
			"exchange-rate": "exchangeRate",
      "current-block": "currentBlock"
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
      this.current = "/";
			var dashboardListener = new RoomListener({
				room: "dashboard"
			});
		},
		currentBlock: function(route){
      this.current = "/current-block";
			var dashboardListener = new RoomListener({
				room: "current-block"
			});
		},

		exchangeRate: function(route){
      this.current = "/exchange-rate";
			var exchangeRateListener = new RoomListener({
				room: "exchange-rate"
			});
		}
	});
};
