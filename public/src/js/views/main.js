/** @jsx React.DOM */
var React = require("react");

var MainView = React.createClass({displayName: 'MainView',
  	render: function() {
		return (
			React.DOM.main({className: "home"}, 
				React.DOM.article(null), 
				React.DOM.article(null), 
				React.DOM.article(null), 
				React.DOM.article(null), 
				React.DOM.article(null), 
				React.DOM.article(null), 
				React.DOM.article(null), 
				React.DOM.article(null)
			)
		);
  	}
});

module.exports = MainView;