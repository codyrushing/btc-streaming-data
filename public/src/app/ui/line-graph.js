// http://bl.ocks.org/mbostock/4015254
// http://computationallyendowed.com/blog/2013/01/21/bounded-panning-in-d3.html
var d3 = require("d3"),
	moment = require("moment"),
	_ = require("lodash");

var LineGraph = function(el, params, data){
	this.el = el;
	this.params = _.defaults(params, {
		comparisonCurrency: "USD"
	});
	this.data = data || [];
	this.init();
};

LineGraph.prototype = {
	init: function(){
		var self = this,
			lineInterpolation = "monotone";

		this.margin = {top: 20, right: 20, bottom: 30, left: 100};
		this.graphWidth = this.params.width - this.margin.left - this.margin.right,
		this.graphHeight = this.params.height - this.margin.top - this.margin.bottom;

		this.x = d3.time.scale()
			.range([0, this.graphWidth]);

		this.y = d3.scale.linear()
			.range([this.graphHeight, 0]);

		this.xAxis = d3.svg.axis()
			.scale(this.x)
			.ticks(Math.ceil(this.graphWidth/100))
			.tickSize(-this.graphHeight)
			.tickFormat(function(d){
				return moment(d).fromNow();
				//return d;
			})
		    .orient("bottom");

		this.yAxis = d3.svg.axis()
		    .scale(this.y)
			.ticks(Math.ceil(this.graphHeight/60))
			.tickSize(-this.graphWidth)
			.tickFormat(function(d){
				return d3.format(".2f")(d3.round(d, 3));
			}.bind(this))
		    .orient("left");

		this.lineGenerator = d3.svg.line()
			// control the curve of the line here
			.interpolate(lineInterpolation)
		    .x(this.xAccessor.bind(this))
		    .y(this.yAccessor.bind(this));

		this.areaGenerator = d3.svg.area()
			.interpolate(lineInterpolation)
			.x(this.xAccessor.bind(this))
			// bottom line
			.y0(this.graphHeight)
			// top line
			.y1(this.yAccessor.bind(this));

		this.transition = d3.select({})
			.transition()
			.duration(750)
			.ease("linear");

		this.zoom = d3.behavior.zoom()
			.on("zoom", this.draw.bind(this));

		this.buildDOM();
		this.update();
	},
	buildDOM: function(){

		this.svg = d3.select(this.el).append("svg")
			.attr("height", this.params.height)
			.attr("width", this.params.width)
			.attr("class", "line-graph")
			.append("g")
			.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

		this.clipPath = this.svg
			.append("defs")
				.append("clipPath")
				.attr("id", "clip")
				.append("rect")
					.attr("width", this.graphWidth)
					.attr("height", this.graphHeight);

		this.svg.append("rect")
		    .attr("class", "bg-fill")
		    .attr("width", this.graphWidth)
		    .attr("height", this.graphHeight);

		this.yAxisGroup = this.svg
			.append("g")
			.attr("class", "y axis");

		this.area = this.svg
			.append("path")
			.attr("clip-path", "url(#clip)")
			.attr("class", "area")
			.attr("id", "main-area");

		this.xAxisGroup = this.svg
			.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + this.graphHeight + ")");

		this.xAxisGroup.select(".domain")
			.attr("stroke-width", "2");

		this.linePath = this.svg
			.append("path")
			.attr("clip-path", "url(#clip)")
			.attr("class", "line");

		this.dotGroup = this.svg
			.append("g")
			.attr("clip-path", "url(#clip)")
			.attr("class", "dot-group");

		this.svg.append("rect")
		    .attr("class", "pane")
		    .attr("width", this.graphWidth)
		    .attr("height", this.graphHeight)
		    .call(this.zoom);

		// this.yAxisLabel = this.yAxisGroup.append("text")
		// 	.attr("class", "label")
		// 	.attr("transform", "rotate(-90)")
		// 	.attr("y", 6)
		// 	.attr("dy", ".71em")
		// 	.style("text-anchor", "end")
		// 	.text("Exchange rate");


	},
	drawPoints: function(){
		var points = this.dotGroup.selectAll(".point")
			.data(this.data);

		// update
		points
			// .transition()
			.attr("cx", this.xAccessor.bind(this))
			.attr("cy", this.yAccessor.bind(this));

		// enter
		points
			.enter().append("svg:circle")
			.attr("class", "point")
			.attr("r", 2)
			.attr("cx", this.xAccessor.bind(this))
			.attr("cy", this.yAccessor.bind(this));

		// exit
		points.exit().remove();
	},
	getXMetric: function(d){
		return d.date;
	},
	getYMetric: function(d){
		return d[this.params.comparisonCurrency].last;
	},
	xAccessor: function(d){
		return this.x(this.getXMetric.call(this, d));
	},
	yAccessor: function(d){
		return this.y(this.getYMetric.call(this, d));
	},
	// not using this yet
	findYatX: function(x, line){
		var getXY = function(len){
			var point = line.getPointAtLength(len);
			return [point.x, point.y];
		};

		var curLen = 0;
		while(getXY(curLen)[0] < x){
			curLen += 0.1;
		}
		return getXY(curLen);
	},
	update: function(newData){
		if(newData){
			this.data = _.compact(newData);
		}

		if(this.data && this.data.length){
			this.comparisonCurrencySymbol = _.last(this.data)[this.params.comparisonCurrency].symbol;
		}

		/* SET DOMAINS */
		var yMin = d3.min(this.data, this.getYMetric.bind(this));
		var yMax = d3.max(this.data, this.getYMetric.bind(this));

  		this.x
  			.domain(d3.extent(this.data, this.getXMetric.bind(this)));

		this.y
  			.domain([
  				yMin - (yMax-yMin)/3,
  				yMax + (yMax-yMin)/3
  			]);

		this.zoom.x(this.x);

		this.linePath.data(this.data);
		this.area.data(this.data);

		this.draw();

		// this.xAxisGroup.selectAll(".tick").each(function(d, i){
		// 	var x = this.x(d);
		// 	console.log(this.linePath.node().getPointAtLength(100));
		// }.bind(this));

		//this.xAxisGroup.selectAll(".tick line")


		// if we have too many data points
		// if(dataOverflow > 0) {
		//
		// 	// horizontal distance that we are going to translate (the distance of the latest point)
		// 	this.translateLeft = this.getSegmentWidth(this.data.length-2, this.data.length-1);
		//
		// 	// compare this.translateLeft to leadingSegmentWidth
		// 	while(this.translateLeft > this.getSegmentWidth(leadingDataToPrune)){
		// 		leadingDataToPrune++;
		// 	}
		//
		// 	this.mainGroup
		// 		.transition()
		// 		.ease("linear")
		// 		.each("end", function(d, i){
		// 			if(leadingDataToPrune){
		// 				this.removeStaleData(leadingDataToPrune);
		// 			}
		// 		}.bind(this))
		// 		.attr("transform", "translate(" + this.translateLeft*-1 + ")");
		//
		// }

	},
	draw: function(){
		if(this.data && this.data.length){

			this.xAxisGroup
				.call(this.xAxis);
			this.yAxisGroup
				.call(this.yAxis);

			this.linePath
				.attr("d", this.lineGenerator(this.data));
			this.area
				.attr("d", this.areaGenerator(this.data));

			this.drawPoints();

		}
	}
};

module.exports = LineGraph;
