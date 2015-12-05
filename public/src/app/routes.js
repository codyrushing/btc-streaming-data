var React = require("react"),
	ReactDOM = require("react-dom"),
	Router = require("react-router").Router,
	Route = require("react-router").Route,
	Link = require("react-router").Link;

var Page = require("./views/page"),
	ExchangeRateView = require("./views/main/exchange-rate"),
	DashboardView = require("./views/main/dashboard"),
	NotFoundView = require("./views/main/not-found");

module.exports = function(el){
	var routes = ReactDOM.render(
		(
		<Router>
			<Route path="/" component={Page}>
				<Route path="exchange-rate" component={ExchangeRateView} />
				<Route path="*" component={NotFoundView} />
			</Route>
		</Router>
		),
		el
	);
};
