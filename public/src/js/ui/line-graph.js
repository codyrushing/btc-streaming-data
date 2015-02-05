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
		    .x(function(d) { 
		    	return x(d.date._d); }
		    )
		    .y(function(d) { 
		    	return y(d.USD.last); }
		    );

		x.domain(d3.extent(this.state, function(d) { return d.date._d; }));
  		y.domain(d3.extent(this.state, function(d) { return d.USD.last; }));

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")
		      .text("Exchange rate");

		svg.append("path")
			.datum(this.state)
			.attr("d", line);

		this.svg = svg;

	},
	update: function(state){
		this.state = state;
		this.svg[0].innerHTML = "";
		this.init();
		// anything other recalculations that need to happen on update can go here
	}
};

module.exports = LineGraph;