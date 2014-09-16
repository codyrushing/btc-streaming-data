var React = require("react");

var MainView = React.createClass({
  	render: function() {
		if(this.props.data){
			return this.dashboard();
		} else {
			return this.bare();
		}
  	},
  	dashboard: function(){
		return (
			<main className="home">
				<h1 className="section-title">Last 24 hours</h1>
				<section className="grid">
					<article className="grid-item"></article>
					<article className="grid-item"></article>
					<article className="grid-item"></article>
					<article className="grid-item"></article>
					<article className="grid-item"></article>
				</section>
			</main>
		);
  	},
  	bare: function(){
  		return (<main></main>);
  	}
});

module.exports = MainView;