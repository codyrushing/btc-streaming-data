var AppDispatcher = require("../dispatcher"),
    constants = require("../constants");

module.exports = {
    subscribe: function(){
        AppDispatcher.dispatch({
            name: constants.SUBSCRIBE_EXCHANGE_RATE
        });
    },
    unsubscribe: function(){
        AppDispatcher.dispatch({
            name: constants.UNSUBSCRIBE_EXCHANGE_RATE
        });
    },
    update: function(){
        AppDispatcher.dispatch({
            name: constants.UPDATE_EXCHANGE_RATE 
        });
    }
};
