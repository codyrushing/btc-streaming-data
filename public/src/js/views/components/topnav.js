/** @jsx React.DOM */
var React = require("react");

var TopNav = React.createClass({displayName: 'TopNav',
	render: function(){
		var navItems = {
			"/": "Dashboard",
			"/exchange-rate": "Exchange rate",
			"/current-block": "Current Block",
			"/transactions": "Transactions"
		},
		nav = Object.keys(navItems).map(function(route){
			var title = navItems[route];
			var className = this.props.currentRoute === route ? "active" : "";
			return (
				React.DOM.a({href: route, title: title, className: className}, title)
			);
		}, this);

		return (
			React.DOM.nav(null, 
				nav
			)
		);
	},
});

module.exports = TopNav;