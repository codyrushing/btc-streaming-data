var _ = require("backbone/node_modules/underscore"),
	Backbone = require("backbone"),
	RoomListener;

module.exports = function(app){
	return Backbone.Router.extend({
		routes: {
			"": "home",
			"test": "test"
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
			console.log("landed on home route");
			console.log(route);
		},
		test: function(route){
			console.log("landed on test route");
			console.log(route);
			var testListener = new RoomListener({
				room: "exchange-rate"
			});

		}
	});
};