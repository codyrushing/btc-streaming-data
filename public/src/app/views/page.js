var React = require("react"),
	TopNav = require("./components/topnav");

var Router = require("react-router");

var PageView = React.createClass({
	contextTypes: {
		router: React.PropTypes.func // router gets passed in directly
	},
  	render: function() {

		return (
			<div className="wrapper">
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
			</div>
		);
  	}
});

module.exports = PageView;
