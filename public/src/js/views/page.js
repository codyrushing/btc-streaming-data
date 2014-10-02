/** @jsx React.DOM */
var React = require("react"),
	MainView = require("./main"),
	TopNav = require("./components/topnav");

var PageView = React.createClass({displayName: 'PageView',
	componentWillMount : function() {
		this.props.dispatcher.on("route", this.onroute, this);
	},
	componentWillUnmount : function() {
    	this.props.dispatcher.off("route", this.onroute, this);
  	},
	onroute: function(route){
		this.setState({
			currentRoute: route
		});
	},
  	getInitialState: function(){
  		return {
  			route: "/"
  		};
  	},
  	render: function() {
		return (
			React.DOM.section({className: "wrapper"}, 
				React.DOM.header(null, 
					React.DOM.a({id: "logo", href: "/"}, 
						"Blockchain", React.DOM.span({className: "highlight"}, " Realtime")
					), 
					TopNav({currentRoute: this.state.currentRoute})
				), 
				MainView({dispatcher: this.props.dispatcher}), 
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
