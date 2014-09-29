var _ = require("backbone/node_modules/underscore"),
	React = require("react"),
	RoomListener;

module.exports = function(app, Backbone){
	return Backbone.Router.extend({
		routes: {
			"": "home",
			"exchange-rate": "exchangeRate",
			"current-block": "currentBlock"
		},
		initialize: function(){
			RoomListener = require("./RoomListener")(app);
			this.on("route", this.on_route);
			this.on("navigate:before", this.on_beforeNavigate);
		},
		on_route: function(route){			
			app.dispatcher.trigger("route", "/" + (this.currentRoute || Backbone.history.fragment) );
			this.currentRoute = null;
		},
		on_beforeNavigate: function(){

		},
		home: function(route){
			var dashboardListener = new RoomListener({
				room: "dashboard"
			});
		},
		currentBlock: function(route){
			var dashboardListener = new RoomListener({
				room: "current-block"
			});
		},
		exchangeRate: function(route){
			var exchangeRateListener = new RoomListener({
				room: "exchange-rate"
			});
		}
	});
};
