var React = require("react"),
	MainView = require("./main");

var PageView = React.createClass({
  	render: function() {
		return (
			<section className="wrapper">
				<header>
					<a id="logo" href="/">
						Blockchain<span className="highlight">&nbsp;Realtime</span>
					</a>
					<nav>
						<a href="https://github.com/codyrushing/btc-streaming-data" target="_blank">Github</a>
					</nav>					
				</header>
				<MainView />
				<footer>
					footer text
				</footer>
			</section>
		);
  	}
});

module.exports = PageView;