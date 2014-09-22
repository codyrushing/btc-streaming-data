/** @jsx React.DOM */
var React = require("react"),
	MainView = require("./main");

var PageView = React.createClass({displayName: 'PageView',
	componentWillMount : function() {
		this.props.dispatcher.on("route", this.onroute, this);
	},
	onroute: function(route){
		this.setState({
			currentRoute: route
		});
	},
	componentWillUnmount : function() {
    	this.props.router.off("route", this.onroute, this);
  	},
  	getInitialState: function(){
  		return {
  			route: "/",
  			data: []
  		};
  	},
  	render: function() {
		var navItems = {
			"/": "Dashboard",
			"/exchange-rate": "Exchange rate",
			"/current-block": "Current Block"
		},
		nav = Object.keys(navItems).map(function(route){
			var title = navItems[route];
			var className = this.state.currentRoute === route ? "active" : "";
			return (
				React.DOM.a({href: route, title: title, className: className}, title)
			);

		}, this);

		return (
			React.DOM.section({className: "wrapper"}, 
				React.DOM.header(null, 
					React.DOM.a({id: "logo", href: "/"}, 
						"Blockchain", React.DOM.span({className: "highlight"}, " Realtime")
					), 
					React.DOM.nav(null, 
						nav
					)
				), 
				MainView(null), 
				React.DOM.footer(null, 
					React.DOM.nav(null, 
						React.DOM.a({href: "https://github.com/codyrushing/btc-streaming-data", target: "_blank"}, "Github")
					)					
				)
			)
		);
  	}
});

module.exports = PageView;
