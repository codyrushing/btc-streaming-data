var d3 = require("d3");

var LineGraph = function(el, props, state){
	this.el = el;
	this.props = props;
	this.state = state;
	this.init();
};

LineGraph.prototype = {
	init: function(){
		var self = this;
			lineInterpolation = "linear";

		this.margin = {top: 20, right: 20, bottom: 30, left: 50};
		this.graphWidth = this.props.width - this.margin.left - this.margin.right,
		this.graphHeight = this.props.height - this.margin.top - this.margin.bottom;

		this.x = d3.time.scale()
			.range([0, this.graphWidth]);
		
		this.y = d3.scale.linear()
			.range([this.graphHeight, 0]);

		this.xAxis = d3.svg.axis()
			.scale(this.x)
			.tickSize(-this.graphHeight)
			.tickSubdivide(true)
		    .orient("bottom");

		this.yAxis = d3.svg.axis()
		    .scale(this.y)
		    .ticks(10)
		    .orient("left");
		
		this.lineGenerator = d3.svg.line()
			// control the curve of the line here
		    .interpolate(lineInterpolation)
		    .x(function(d) { 
		    	return this.x(this.xAccessor(d));
		    }.bind(this))
		    .y(function(d) { 
		    	return this.y(this.yAccessor(d));
		    }.bind(this));

		this.areaGenerator = d3.svg.area()
			.interpolate(lineInterpolation)
			.x(function(d){
				return this.x(this.xAccessor(d));
			}.bind(this))
			.y0(this.graphHeight)
			.y1(function(d){
				return this.y(this.yAccessor(d));
			}.bind(this));

		this.tickClipAreaGenerator = d3.svg.area()
			.interpolate(lineInterpolation)
			.x(function(d){
				return this.x(this.xAccessor(d));
			}.bind(this))
			.y1(function(d){
				return this.y(this.yAccessor(d));
			}.bind(this))
			.y0(0);

		this.buildDOM();
	},
	buildDOM: function(){

		this.svg = d3.select(this.el).append("svg")
			.attr("height", this.props.height)
			.attr("width", this.props.width)
			.attr("class", "line-graph")
			.append("g")
			.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

		this.linePath = this.svg.append("path")
			.attr("class", "line");

		this.clipPath = this.svg.append("clipPath")
			.attr("id", "clip")
			.append("rect")
				.attr("width", this.graphWidth)
				.attr("height", this.graphHeight);

		this.tickClipPath = this.svg.append("clipPath")
			.attr("id", "tick-clip")
			.append("path")
			.attr("fill", "#ff0000");

		this.area = this.svg.append("path")
			.attr("class", "area")
			.attr("clip-path", "url(#clip)")
			.attr("fill", "#4682B4");

		this.xAxisGroup = this.svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + this.graphHeight + ")");

		this.yAxisGroup = this.svg.append("g")
			.attr("class", "y axis");		

		// this.yAxisLabel = this.yAxisGroup.append("text")
		// 	.attr("class", "label")
		// 	.attr("transform", "rotate(-90)")
		// 	.attr("y", 6)
		// 	.attr("dy", ".71em")
		// 	.style("text-anchor", "end")
		// 	.text("Exchange rate");


	},
	drawPoints: function(){
		var self = this,
			points = this.svg.selectAll(".point")
				.data(this.state);

		// update
		points
			.transition()
			.attr("cx", function(d){
				return self.x(self.xAccessor(d));
			})
			.attr("cy", function(d){
				return self.y(self.yAccessor(d));
			});

		// enter
		points
			.enter().append("svg:circle")
			.attr("class", "point")			
			.attr("r", 5)			
			.attr("cx", function(d){
				return self.x(self.xAccessor(d));
			})
			.attr("cy", function(d){
				return self.y(self.yAccessor(d));
			});
		
		// exit		
		points.exit().remove();
	},
	xAccessor: function(d){
		return d.date._d;
	},
	yAccessor: function(d){
		return d.USD.last;
	},
	update: function(state){
		/* SET DOMAINS */
		var yMin, yMax;

		if(state){
			this.state = state;
		}

		yMin = d3.min(this.state, this.yAccessor);
		yMax = d3.max(this.state, this.yAccessor);
  		
  		this.x
  			.domain(d3.extent(this.state, this.xAccessor));

		this.y
  			.domain([
  				yMin - (yMax-yMin)/3,
  				yMax + (yMax-yMin)/3
  			]);

		this.xAxisGroup
			.call(this.xAxis);

		this.yAxisGroup
			.call(this.yAxis);

		// change the tick clip path
		this.tickClipPath
			.transition()
			.attr("d", this.tickClipAreaGenerator(this.state));

		// add the "clip-path" attr to all ticks
		this.xAxisGroup.selectAll(".tick line")
			.attr("clip-path", "url(#tick-clip)")

		this.linePath
			.datum(this.state)
			.transition()
			.attr("d", this.lineGenerator);

		this.area
			.transition()
			.attr("d", this.areaGenerator(this.state));

		this.drawPoints();

	}
};

module.exports = LineGraph;