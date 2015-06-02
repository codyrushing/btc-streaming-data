var io = require("socket.io-client");

module.exports = io(window.location.protocol + "//" + window.location.host);
