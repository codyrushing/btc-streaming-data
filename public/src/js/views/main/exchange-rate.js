/** @jsx React.DOM */
var React = require("react"),
	LineGraph = require("../../ui/line-graph"),
	RoomListener = require("../../base/RoomListener");

var ExchangeRateView = React.createClass({displayName: 'ExchangeRateView',
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
			{},
			this.state
		);
	},
	componentDidUpdate: function(){
		if(this.lineGraph){
			this.lineGraph.update(this.state);
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
  				React.DOM.p(null, entry.date)
  			);
  		});
  		return (
  			React.DOM.main({className: "exchange-rate"}, 
  				exchangeRateEntries, 
  				React.DOM.div({className: "chart-container"}

  				)
  			)
  		);
  	}
});

module.exports = ExchangeRateView;