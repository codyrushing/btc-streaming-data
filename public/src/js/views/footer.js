/** @jsx React.DOM */
var React = require("react");

var FooterView = React.createClass({displayName: 'FooterView',
  	render: function() {
		return (
			React.DOM.footer(null, 
				"footer text"
			)
		);
  	}
});

module.exports = FooterView;