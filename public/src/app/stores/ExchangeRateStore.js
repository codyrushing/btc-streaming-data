var _ = require("lodash"),
    AppDispatcher = require("../dispatcher"),
    EventEmitter2 = require("eventemitter2").EventEmitter2,
    constants = require("../constants"),
    RoomListener = require("../base/RoomListener");

var ExchangeRateStore = _.assign({}, EventEmitter2.prototype, {
    items: [],
    accessor: function(data){
        return data && data.USD ? data.USD.last : null;
    },
    // if we already have two identical data points at the end of our array
    // then knock out the middle one and add the new one 
    isUnchanged: function(incoming){
        var penUlt = this.accessor(this.items[this.items.length-2]),
            ult = this.accessor(_.last(this.items));
        return this.items.length > 2 && (penUlt === ult) && (ult === this.accessor(incoming));
    },
    add: function(item){
        if(this.isUnchanged(item)){
            this.items.pop();
        }
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
