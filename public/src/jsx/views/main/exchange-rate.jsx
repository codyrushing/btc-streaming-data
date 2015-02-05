var React = require("react"),
	LineGraph = require("../../ui/line-graph"),
	RoomListener = require("../../base/RoomListener");

var ExchangeRateView = React.createClass({
	componentWillMount: function(){
		this.props.dispatcher.on("data", this.ondata.bind(this));
		this.roomListener = new RoomListener(this.props.socket, this.props.dispatcher, {
			room: "exchange-rate"
		});
	},
	componentWillUnmount: function(){
		this.props.dispatcher.off("data", this.ondata.bind(this));
		this.roomListener.exit();
	},
	componentDidMount: function(){
		this.chartContainer = this.getDOMNode().querySelectorAll(".chart-container")[0];
		this.lineGraph = new LineGraph(
			this.chartContainer,
			{
				width: 500,
				height: 300
			},
			this.state.entries
		);
	},
	componentDidUpdate: function(){
		if(this.lineGraph){
			this.lineGraph.update(this.state.entries);
		}
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
  		var exchangeRateEntries = this.state.entries.map(function(entry){
  			return (
  				<p>{entry.date}</p>
  			);
  		});
  		return (
  			<main className="exchange-rate">
  				{exchangeRateEntries}
  				<div className="chart-container">

  				</div>
  			</main>
  		);
  	}
});

module.exports = ExchangeRateView;