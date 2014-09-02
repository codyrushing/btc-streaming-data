/** @jsx React.DOM */
var React = require("react"),
	MainView = require("./main");

var PageView = React.createClass({displayName: 'PageView',
  	render: function() {
		return (
			React.DOM.section({className: "wrapper"}, 
				React.DOM.header(null, 
					React.DOM.a({id: "logo", href: "/"}, 
						"Blockchain", React.DOM.span({className: "highlight"}, " Realtime")
					), 
					React.DOM.nav(null, 
						React.DOM.a({href: "https://github.com/codyrushing/btc-streaming-data", target: "_blank"}, "Github")
					)					
				), 
				MainView(null), 
				React.DOM.footer(null, 
					"footer text"
				)
			)
		);
  	}
});

module.exports = PageView;