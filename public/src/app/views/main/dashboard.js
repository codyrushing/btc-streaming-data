var React = require("react");

var DashboardView = React.createClass({
  render: function(){
	return (
	  <main>
		<section className="grid dashboard">

		  <div className="dashboard-header">
			<h1>Dashboard</h1>
		  </div>

		  <div class="dashboard-metrics">

            <div className="metric exchange-rate">
                <h3>Exchange rate</h3>
			</div>

			<div className="metric transaction-volume">
                <h3>Transaction volume</h3>
			</div>

			<div className="metric trade-volume">
                <h3>Transaction volume</h3>
			</div>

			<div className="metric market-cap">
                <h3>Market capitalization</h3>
			</div>

			<div className="metric total-bc">
                <h3>Total in circulation</h3>
			</div>

		  </div>

		</section>
	  </main>
	);
  }
});

module.exports = DashboardView;
