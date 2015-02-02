var d3 = require("d3");

var LineGraph = function(el, props, state){
	this.el = el;
	this.props = props;
	this.state = state;
	this.init();
};

LineGraph.prototype = {
	init: function(){
		var height = 300,
			width = 500;

		var svg = d3.select(this.el).append("svg")
			.attr("height", height)
			.attr("width", width)
			.append("g");

		var x = d3.time.scale()
				.range([0, width]),
			y = d3.time.scale()
				.range([height, 0]);

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left");

		var line = d3.svg.line()
		    .x(function(d) { return x(d.date); })
		    .y(function(d) { return y(d.close); });
	},
	update: function(state){
		this.state = state;
		// anything other recalculations that need to happen on update can go here
	}
};

module.exports = LineGraph;