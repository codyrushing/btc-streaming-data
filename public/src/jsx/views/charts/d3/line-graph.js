var d3 = require("d3");

var LineGraph = function(el, props, state){
	this.init();
};

LineGraph.prototype = {
	init: function(){
		var height = 300,
			width = 500,
			x = d3.time.scale()
				.range([0, width]),
			y = d3.time.scale()
				.range([height, 0]);

		this.svg = d3.select(el).append("svg")
			.attr("height", height)
			.attr("width", width);
	}
};