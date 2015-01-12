/** @jsx React.DOM */
var React = require("react"),
	TopNav = require("./components/topnav"),
	ExchangeRate = require("./main/exchange-rate");

var PageView = React.createClass({displayName: 'PageView',
	componentWillMount : function() {
		this.props.dispatcher.on("route", this.onroute, this);
	},
	componentWillUnmount : function() {
    	this.props.dispatcher.off("route", this.onroute, this);
  	},
  	// Backbone Router will emit "route" events to dispatcher on route change
	onroute: function(route){
		this.setState({
			currentRoute: route
		});
	},
  	getInitialState: function(){
  		return {
  			currentRoute: "/"
  		};
  	},
  	getMainView: function(){
		switch(this.state.currentRoute){
			case "/exchange-rate":
				return ExchangeRate;
			default:
				return React.createClass({
					render: function(){
						return (React.DOM.main(null, this.props.currentRoute, " Not found..."));
					}
				});
		};
  	},
  	render: function() {
		var MainView = this.getMainView();

		return (
			React.DOM.section({className: "wrapper"}, 
				React.DOM.header(null, 
					React.DOM.a({id: "logo", href: "/"}, 
						"Blockchain", React.DOM.span({className: "highlight"}, " Realtime")
					), 
					TopNav({currentRoute: this.state.currentRoute})
				), 
				MainView({dispatcher: this.props.dispatcher, socket: this.props.socket}), 
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
