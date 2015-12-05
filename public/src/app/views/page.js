var React = require("react"),
	TopNav = require("app/views/components/topnav");

var Router = require("react-router");

var PageView = React.createClass({
	contextTypes: {
		router: React.PropTypes.func // router gets passed in directly
	},
  	render: function() {
		return (
			<div className="page">
				<header>
					<a id="logo" href="/">
						Blockchain<span className="highlight">&nbsp;Realtime</span>
					</a>
					<TopNav />
				</header>
				{this.props.mainView}
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
