/** @jsx React.DOM */
var React = require("react");

var MainView = React.createClass({displayName: 'MainView',
  	render: function() {
		if(this.props.data){
			return this.dashboard();
		} else {
			return this.bare();
		}
  	},
  	dashboard: function(){
		return (
			React.DOM.main({className: "home"}, 
				React.DOM.h1({className: "section-title"}, "Last 24 hours"), 
				React.DOM.section({className: "grid"}, 
					React.DOM.article({className: "grid-item"}), 
					React.DOM.article({className: "grid-item"}), 
					React.DOM.article({className: "grid-item"}), 
					React.DOM.article({className: "grid-item"}), 
					React.DOM.article({className: "grid-item"})
				)
			)
		);
  	},
  	bare: function(){
  		return (React.DOM.main(null));
  	}
});

module.exports = MainView;