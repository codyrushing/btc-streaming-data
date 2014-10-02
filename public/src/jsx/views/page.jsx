var React = require("react"),
	MainView = require("./main"),
	TopNav = require("./components/topnav");

var PageView = React.createClass({
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
			<section className="wrapper">
				<header>
					<a id="logo" href="/">
						Blockchain<span className="highlight">&nbsp;Realtime</span>
					</a>
					<TopNav currentRoute={this.state.currentRoute} />
				</header>
				<MainView dispatcher={this.props.dispatcher} />
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
