var _ = require("backbone/node_modules/underscore"),
	Backbone = require("backbone");

module.exports = Backbone.Router.extend({
	routes: {
		"": "home",
		"test": "test"
	},
	initialize: function(){
		console.log("router init");
		//_.bindAll(this);
	},
	home: function(route){
		console.log("landed on home route");
		console.log(route);
	},
	test: function(route){
		console.log("landed on test route");
		console.log(route);				
	}
});