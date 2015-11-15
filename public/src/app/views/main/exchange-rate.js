var React = require("react"),
	_ = require("lodash"),
	constants = require("../../constants"),
	LineGraph = require("../../ui/line-graph"),
	AppDispatcher = require("../../dispatcher"),
	ExchangeRateStore = require("../../stores/ExchangeRateStore"),
	ExchangeRateActions = require("../../actions/ExchangeRateActions");

var ExchangeRateView = React.createClass({
	getDefaultProps: function(){
		return {
			maxData: 100
		};
	},
	componentWillMount: function(){
		// flux way
		ExchangeRateActions.subscribe();
		ExchangeRateStore.on("change", this._onData.bind(this));

		// old way
		// this.props.dispatcher.on("data", this._onData.bind(this));
		// this.props.dispatcher.on("data", this._onPrune.bind(this));
		// this.roomListener = new RoomListener(this.props.socket, this.props.dispatcher, {
		// 	room: "exchange-rate"
		// });
	},
	componentWillUnmount: function(){
		ExchangeRateActions.unsubscribe();

		// old way
		// this.props.dispatcher.off("data", this._ondata.bind(this));
		// this.roomListener.exit();
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
	_onData: function(){
		this.setState({
			entries: ExchangeRateStore.getAll()
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
