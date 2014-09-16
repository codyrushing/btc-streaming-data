var React = require("react"),
	MainView = require("./main");

var PageView = React.createClass({
  	getInitialState: function(){
  		return {
  			route: "/",
  			data: []
  		};
  	},
  	bindEvents: function(){
		this.dispatcher.on("route", function(route){
			this.setState({
				route: "/"+route
			});
		}, this);
  	},
  	render: function() {
		var navItems = {
			"/": "Dashboard",
			"/exchange-rate": "Exchange rate",
			"/current-block": "Current Block"
		},
		nav = Object.keys(navItems).map(function(route){
			var title = navItems[route],
				className = this.state.route === route ? "active" : "";

			return (
				<a href={route} title={title} className={className}>{title}</a>
			);

		}, this);

		return (
			<section className="wrapper">
				<header>
					<a id="logo" href="/">
						Blockchain<span className="highlight">&nbsp;Realtime</span>
					</a>
					<nav>
						{nav}
					</nav>
				</header>
				<MainView />
				<footer>
					<nav>
						<a href="https://github.com/codyrushing/btc-streaming-data" target="_blank">Github</a>
					</nav>					
				</footer>
			</section>
		);
  	}
});

module.exports = PageView;