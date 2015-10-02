"use strict";

function EventEmitter() {}

//Basic listener
EventEmitter.prototype.on = function on(name, callback, context) {
    if(!this.events)
        this.events = {};

    if(!this.events[name])
        this.events[name] = [];

    this.events[name].push({
        callback: callback,
        context: context
    });
};

//Basic trigger
EventEmitter.prototype.emit = function emit(name, data) {
    if(!this.events || !this.events[name]) return;

    var self = this;

    this.events[name].forEach(function(eventHandler, index) {
        if(eventHandler.context)
            eventHandler.callback(data).bind(eventHandler.context);
        else
            eventHandler.callback(data);

        //If the event can only be trigger once
        if(eventHandler.unique) {
            self.events[name].splice(index, 1);
        }
    });
};

//Remove the event listener
EventEmitter.prototype.off = function off(name, callback) {
    if(!this.events || !this.events[name]) return;

    var self = this;

    //Case remove all
    if(!name && !callback) {
        this.events = {};
    }
    else if(!callback) {
        this.events[name] = [];
    }
    else {
        this.events[name].forEach(function(eventHandler, index) {
            if(eventHandler.callback.toString() == callback.toString())
                self.events[name].splice(index, 1);
        });
    }
};

//Can be trigger only once
EventEmitter.prototype.once = function once(name, callback, context) {
    if(!this.events)
        this.events = {};

    if(!this.events[name])
        this.events[name] = [];

    this.events[name].push({
        callback: callback,
        context: context,
        unique: true
    });
};

//Listen for all of the instances of one object
EventEmitter.prototype.listen = function listen(name, callback, context) {
    if(!this.broadcastEvents)
        this.broadcastEvents = {};

    if(!this.broadcastEvents[name])
        this.broadcastEvents[name] = [];

    this.broadcastEvents[name].push({
        callback: callback,
        context: context
    });
};

//Listen for all of the instances of one object
EventEmitter.prototype.listenOnce = function listenOnce(name, callback, context) {
    if(!this.broadcastEvents)
        this.broadcastEvents = {};

    if(!this.broadcastEvents[name])
        this.broadcastEvents[name] = [];

    this.broadcastEvents[name].push({
        callback: callback,
        context: context,
        unique: true
    });
};

//Trigger event for all of the instances of one object
EventEmitter.prototype.broadcast = function broadcast(name, data) {
    if(!this.broadcastEvents || !this.broadcastEvents[name]) {
        return;
    }

    var self = this;

    this.broadcastEvents[name].forEach(function(eventHandler, index) {
        if(eventHandler.context)
            eventHandler.callback(data).bind(eventHandler.context);
        else
            eventHandler.callback(data);

        //If the event can only be trigger once
        if(eventHandler.unique) {
            self.broadcastEvents[name].splice(index, 1);
        }
    });
};

EventEmitter.prototype.unset = function unset(name, callback) {
    if(!this.broadcastEvents || !this.broadcastEvents[name]) return;

    var self = this;

    //Case remove all
    if(!name && !callback) {
        this.broadcastEvents = {};
    }
    else if(!callback) {
        this.broadcastEvents[name] = [];
    }
    else {
        this.broadcastEvents[name].forEach(function(eventHandler, index) {
            if(eventHandler.callback.toString() == callback.toString())
                self.broadcastEvents[name].splice(index, 1);
        });
    }
};