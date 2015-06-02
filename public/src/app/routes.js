var React = require("react"),
	Router = require("react-router"),
	Route = Router.Route,
	DefaultRoute = Router.DefaultRoute,
	NotFoundRoute = Router.NotFoundRoute;

var Page = require("./views/page"),
	ExchangeRateView = require("./views/main/exchange-rate"),
	DashboardView = require("./views/main/dashboard"),
	NotFoundView = require("./views/main/not-found");

var routes = (
	<Route name="app" path="/" handler={Page}>
		<Route name="exchange-rate" handler={ExchangeRateView} />
		<DefaultRoute handler={DashboardView} />
		<NotFoundRoute handler={NotFoundView} />
	</Route>
);

module.exports = routes;
