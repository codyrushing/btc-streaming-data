var React = require("react");

var TopNav = React.createClass({
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
				<a href={route} title={title} className={className}>{title}</a>
			);
		}, this);

		return (
			<nav>
				{nav}
			</nav>
		);
	},
});

module.exports = TopNav;