var _ = require("lodash"),
    AppDispatcher = require("../dispatcher"),
    EventEmitter2 = require("eventemitter2").EventEmitter2,
    constants = require("../constants"),
    RoomListener = require("../base/RoomListener");

var ExchangeRateStore = _.assign({}, EventEmitter2.prototype, {
    items: [],
    add: function(item){
        this.items.push(item);
        this.emit("change");
    },
    getAll: function(){
        return this.items;
    },
    getCurrent: function(){
        return _.last(this.items);
    }
});

var ExchangeRateRoomListener = new RoomListener({
    room: "exchange-rate",
    events: {
        data: function(data){
            AppDispatcher.dispatch({
                name: constants.UPDATE_EXCHANGE_RATE,
                data: data
            });
        }
    }
});

// register callbacks
ExchangeRateStore.dispatchToken = AppDispatcher.register(function(action) {
    // TODO is a switch case really the best way to do this?
    switch(action.name){
        case constants.SUBSCRIBE_EXCHANGE_RATE:
            // start socket listening
            ExchangeRateRoomListener.init();
            break;
        case constants.UNSUBSCRIBE_EXCHANGE_RATE:
            // stop socket listening
            ExchangeRateRoomListener.destroy();
            break;
        case constants.UPDATE_EXCHANGE_RATE:
            // do something with action.data
            ExchangeRateStore.add(action.data);
            break;
    };
});

module.exports = ExchangeRateStore;
