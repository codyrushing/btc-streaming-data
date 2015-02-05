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
		var self = this;
		this.svg = d3.select(this.el).append("svg")
			.attr("height", this.props.height)
			.attr("width", this.props.width)
			.append("g");

		this.x = d3.time.scale()
				.range([0, this.props.width]);
		
		this.y = d3.time.scale()
				.range([this.props.height, 0]);

		this.xAxis = d3.svg.axis()
		    .scale(this.x)
		    .orient("bottom");

		this.yAxis = d3.svg.axis()
		    .scale(this.y)
		    .orient("left");

		this.line = d3.svg.line()
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

		this.svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + this.props.height + ")")
			.call(this.xAxis);

		this.svg.append("g")
			.attr("class", "y axis")
			.call(this.yAxis)
			.append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")
		      .text("Exchange rate");

		this.svg.append("path")
			.datum(this.state)
			.attr("d", this.line);
	},
	update: function(state){
		this.state = state;
		this.build();
		// anything other recalculations that need to happen on update can go here
	}
};

module.exports = LineGraph;