var d3 = require("d3");

var LineGraph = function(el, props, state){
	this.el = el;
	this.props = props;
	this.state = state;
	this.init();
	this.build();
};

LineGraph.prototype = {
	init: function(){
		var self = this,
			margin = {top: 20, right: 20, bottom: 30, left: 50};
			
		this.graphWidth = this.props.width - margin.left - margin.right,
		this.graphHeight = this.props.height - margin.top - margin.bottom;

		this.svg = d3.select(this.el).append("svg")
			.attr("height", this.props.height)
			.attr("width", this.props.width)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		this.x = d3.time.scale()
				.range([0, this.graphWidth]);
		
		this.y = d3.time.scale()
				.range([this.graphHeight, 0]);

		this.xAxis = d3.svg.axis()
		    .scale(this.x)
		    .orient("bottom");

		this.yAxis = d3.svg.axis()
		    .scale(this.y)
		    .orient("left");

		this.line = d3.svg.line()
		    .interpolate("cardinal")
		    .x(function(d) { 
		    	return self.x(d.date._d); 
		    })
		    .y(function(d) { 
		    	return self.y(d.USD.last); 
		    });
	},
	build: function(){
		this.x
			.domain(d3.extent(this.state, function(d) { 
				return d.date._d; 
			}));
  		
  		this.y
  			.domain(d3.extent(this.state, function(d) { 
  				return d.USD.last; 
  			}));

  		this.svg.select(".x.axis").remove();

		this.svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + this.graphHeight + ")")
			.call(this.xAxis);

  		this.svg.select(".y.axis").remove();

		this.svg.append("g")
			.attr("class", "y axis")
			.call(this.yAxis)
			.append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")
		      .text("Exchange rate");

		this.svg.select(".line").remove();

		this.svg.append("path")
			.datum(this.state)
			.attr("class", "line")
			.attr("d", this.line);

		this.point = this.svg.selectAll(".point")
			.data(this.state);

		this.point
			.enter().append("svg:circle")
			.attr("class", "point")
			.attr("cx", function(d){
				console.log(d.date._d);
				console.log(this.x(d.date._d));
				return this.x(d.date._d);
			}.bind(this))
			.attr("cy", function(d){
				return this.y(d.USD.last)
			}.bind(this))
			.attr("r", 3);

		this.point.exit().remove();
	},
	update: function(state){
		this.state = state;
		this.build();
		// anything other recalculations that need to happen on update can go here
	}
};

module.exports = LineGraph;