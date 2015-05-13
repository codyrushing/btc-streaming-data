var React = require("react"),
	TopNav = require("./components/topnav");

var Router = require("react-router");

var PageView = React.createClass({
	contextTypes: {
		router: React.PropTypes.func
	},
	/*
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
  	*/
  	render: function() {

		return (
			<div>
				<section className="wrapper">
					<header>
						<a id="logo" href="/">
							Blockchain<span className="highlight">&nbsp;Realtime</span>
						</a>
						<TopNav />
					</header>

					<Router.RouteHandler />

					<footer>
						<nav>
							<a href="https://github.com/codyrushing/btc-streaming-data" target="_blank">Github</a>
						</nav>
					</footer>
				</section>

			</div>
		);
  	}
});

module.exports = PageView;
