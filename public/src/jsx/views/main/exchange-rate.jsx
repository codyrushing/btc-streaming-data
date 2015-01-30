var React = require("react"),
	LineGraph = require("../charts/line-graph"),
	RoomListener = require("../../base/RoomListener");

var ExchangeRateView = React.createClass({
	componentWillMount: function() {
		this.props.dispatcher.on("data", this.ondata.bind(this));
		this.roomListener = new RoomListener(this.props.socket, this.props.dispatcher, {
			room: "exchange-rate"
		});
	},
	componentWillUnmount: function(){
		this.props.dispatcher.off("data", this.ondata.bind(this));
		this.roomListener.exit();
	},
	ondata: function(data){
		var entries = this.state.entries;
		entries.push(data);
		this.setState({
			entries: entries
		});
	},
	getInitialState: function(){
		return {
			entries: []
		};
	},
  	render: function() {
  		// var exchangeRateEntries = this.state.entries.map(function(entry){
  		// 	return (
  		// 		<p>{entry.date}</p>
  		// 	);
  		// });
  		return (
  			<main className="exchange-rate">
  				<LineGraph data={this.state.entries} />
  			</main>
  		);
  	}
});

module.exports = ExchangeRateView;