var Backbone = require("backbone");
module.exports = function(dispatcher){
	return Backbone.Router.extend({
		routes: {
			"*catchall": "catchall"
		},
		initialize: function(){
			this.on("route", this.on_route);
			this.on("navigate:before", this.on_beforeNavigate);
		},
		on_route: function(route){
			dispatcher.trigger("route", "/" + (this.currentRoute || Backbone.history.fragment) );
			this.currentRoute = null;
		},
		on_beforeNavigate: function(){

		},
		catchall: function(){
			// what
		}
	});
};
