var configs = {
	development: {
		db: "localhost/blockchain_realtime",
		dbUser: null,
		dbPwd: null
	},
	production: {
		db: "localhost/blockchain_realtime",
		dbUser: "dbUserName",
		dbPwd: "dbPassword"
	}
};

module.exports = configs[process.env.NODE_ENV ? process.env.NODE_ENV : "development"];
