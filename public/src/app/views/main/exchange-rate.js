var React = require("react"),
	LineGraph = require("../../ui/line-graph"),
	RoomListener = require("../../base/RoomListener"),
	_ = require("lodash");

var ExchangeRateView = React.createClass({
	getDefaultProps: function(){
		return {
			maxData: 10,
		};
	},
	componentWillMount: function(){
		this.props.dispatcher.on("data", this._onData.bind(this));
		this.props.dispatcher.on("data", this._onPrune.bind(this));
		this.roomListener = new RoomListener(this.props.socket, this.props.dispatcher, {
			room: "exchange-rate"
		});
	},
	componentWillUnmount: function(){
		this.props.dispatcher.off("data", this._ondata.bind(this));
		this.roomListener.exit();
	},
	componentDidMount: function(){
		this.chartContainer = this.getDOMNode().querySelectorAll(".chart-container")[0];
		this.lineGraph = new LineGraph(
			this.chartContainer,
			{
				width: 800,
				height: 500,
				maxData: this.props.maxData,
				dispatcher: this.props.dispatcher,
				name: "exchange-rate"
			},
			this.state.entries
		);
	},
	componentDidUpdate: function(){
		var dataOverflow = this.state.entries.length - this.props.maxData,
			entries;
		if(this.lineGraph){
			this.lineGraph.update(this.state.entries);
		}

		// this will be a reduction, should not cause a render
		// if(dataOverflow > 0){
		// 	entries = _.clone(this.state.entries);

		// 	this.setState({
		// 		entries: entries.slice(dataOverflow, entries.length)
		// 	});			
		// }
	},
	shouldComponentUpdate: function(nextProps, nextState){
		// if we are reducing data, do not update
		return nextState.entries.length >= this.state.entries.length;
	},
	_onData: function(data){
		var entries = _.clone(this.state.entries);
		entries.push(data);

		this.setState({
			entries: entries
		});
	},
	_onPrune: function(index){
		this.setState({
			entries: this.state.entries.slice(index, this.state.entries.length)
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
  				<div className="chart-container">

  				</div>
  			</main>
  		);
  	}
});

module.exports = ExchangeRateView;