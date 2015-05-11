// https://stackoverflow.com/questions/11503151/in-d3-how-to-get-the-interpolated-line-data-from-a-svg-line

var d3 = require("d3"),
	_ = require("lodash");

var LineGraph = function(el, props, data){
	this.el = el;
	this.props = _.defaults(props, {
		targetDataLength: 10
	});
	this.data = data || [];
	this.init();
};

LineGraph.prototype = {
	init: function(){
		var self = this,
			lineInterpolation = "cardinal";

		this.margin = {top: 20, right: 20, bottom: 30, left: 50};
		this.graphWidth = this.props.width - this.margin.left - this.margin.right,
		this.graphHeight = this.props.height - this.margin.top - this.margin.bottom;

		this.translateLeft = 0;

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
		    .ticks(5)
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

		this.transition = d3.select({})
			.transition()
			.duration(750)
			.ease("linear");

		this.buildDOM();
	},
	buildDOM: function(){

		this.svg = d3.select(this.el).append("svg")
			.attr("height", this.props.height)
			.attr("width", this.props.width)
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

		this.xAxisGroup = this.svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + this.graphHeight + ")");

		this.yAxisGroup = this.svg.append("g")
			.attr("class", "y axis");

		this.mainGroup = this.svg.append("g")
			.attr("clip-path", "url(#clip)");

		this.linePath = this.mainGroup
			.append("path")
			.attr("class", "line");

		this.area = this.mainGroup
			.append("path")
			.attr("class", "area")
			.attr("id", "main-area")
			.attr("fill", "#4682B4");

		this.dotGroup = this.mainGroup
			.append("g")
			.attr("class", "dot-group");

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
			points = this.dotGroup.selectAll(".point")
				.data(this.data);

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
			.attr("r", 2)			
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

	getSegmentWidth: function(i){
		return this.x(this.xAccessor(this.data[i+1])) - this.x(this.xAccessor(this.data[i]));
	},

	update: function(newData){
		var yMin, yMax,
			leadingDataToPrune = 0,
			dataOverflow = 0;

		/* SET DOMAINS */
		yMin = d3.min(this.data, this.yAccessor);
		yMax = d3.max(this.data, this.yAccessor);
  		
  		this.x
  			.domain(d3.extent(this.data, this.xAccessor));

		this.y
  			.domain([
  				yMin - (yMax-yMin)/3,
  				yMax + (yMax-yMin)/3
  			]);

		this.xAxisGroup
			.call(this.xAxis);

		this.yAxisGroup
			.call(this.yAxis);

		if(newData){
			this.data = newData;
			dataOverflow = this.data.length - this.props.maxData;
		}

		this.linePath
			.attr("d", this.lineGenerator(this.data));

		this.area
			.attr("d", this.areaGenerator(this.data));

		// this.xAxisGroup.selectAll(".tick").each(function(d, i){
		// 	var x = this.x(d);
		// 	console.log(this.linePath.node().getPointAtLength(100));
		// }.bind(this));

		//this.xAxisGroup.selectAll(".tick line")

		this.drawPoints();

		// if we have too many data points
		if(dataOverflow > 0) {

			// horizontal distance that we are going to translate
			this.translateLeft = this.getSegmentWidth(this.data.length-2);

			// compare this.translateLeft to leadingSegmentWidth
			while(this.translateLeft > this.getSegmentWidth(leadingDataToPrune)){
				leadingDataToPrune++;
			}

			this.mainGroup
				.transition()
				.ease("linear")
				.each("end", function(d, i){
					if(leadingDataToPrune){
						this.props.dispatcher.emit("prune", leadingDataToPrune);
					}
				}.bind(this))
				.attr("transform", "translate(" + this.translateLeft*-1 + ")");

		}

	}
};

module.exports = LineGraph;