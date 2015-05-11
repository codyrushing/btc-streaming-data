var React = require("react");

var NotFoundView = React.createClass({
	render: function(){
		return (<main>{this.props.currentRoute} Not found...</main>);
	}
});

module.exports = NotFoundView;