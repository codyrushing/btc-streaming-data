var React = require("react"),
	TopNav = require("./components/topnav"),
	ExchangeRate = require("./main/exchange-rate");

var PageView = React.createClass({
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
						return (<main>{this.props.currentRoute} Not found...</main>);
					}
				});
		};
  	},
  	render: function() {
		var MainView = this.getMainView();

		return (
			<section className="wrapper">
				<header>
					<a id="logo" href="/">
						Blockchain<span className="highlight">&nbsp;Realtime</span>
					</a>
					<TopNav currentRoute={this.state.currentRoute} />
				</header>
				<MainView dispatcher={this.props.dispatcher} socket={this.props.socket} />
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
