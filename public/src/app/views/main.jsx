var React = require("react"),
	app = require("../app");

var MainView = React.createClass({
	componentWillMount: function() {
		this.props.dispatcher.on("data", this.ondata.bind(this));
	},
	componentWillUnmount: function(){
		this.props.dispatcher.off("data", this.ondata.bind(this));
	},
	ondata: function(data){
		console.log("woo, got some data in the main view");
		console.log(data);
	},
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