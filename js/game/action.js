"use strict";

//Distance pour les events +
var DISY = 150;
var DISX = 200;

function Action() {
    this.container = document.querySelector('#game');
    this.data = {};
    this.fired = null;

    this.container.addEventListener('touchstart', this.startHandle.bind(this), false);
    this.container.addEventListener('touchend', this.endHandle.bind(this), false);
    this.container.addEventListener('touchmove', this.moveHandle.bind(this), false);

	document.addEventListener('keydown', this.keyHandle.bind(this), false);

    return this;
}

Action.prototype.on = function on(name, callback, context) {
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
Action.prototype.emit = function emit(name, data) {
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

Action.prototype.startHandle = function(event) {
    this.data.start = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
    };

    this.emit('start', this.data);
};

Action.prototype.endHandle = function(event) {
    this.fired    = false;

    //Set the end data points
    if(event.changedTouches.length > 0) {
        this.data.end = {
            x: event.changedTouches[0].clientX,
            y: event.changedTouches[0].clientY
        };
    }
    else {
        this.data.end = {};
    }

    //Know the direction of the swipe
    this.setDirection();

    //Verify it's not a simple click
    if(event.changedTouches.length > 0 && (this.data.end.x != this.data.start.x || this.data.end.y != this.data.start.y)) {
        this.emit('end', this.data);
    }
};

Action.prototype.moveHandle = function(event) {
    var self = this;

    this.data.move = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
    };

    this.data.diff = {
        x: (this.data.start.x || 0) - this.data.move.x,
        y: (this.data.start.y || 0) - this.data.move.y
    };

    //Know the direction of the swipe
    this.setDirection();

    //Inform
    this.emit('move', this.data);

    if (this.fired) return;

    //Left
    if (this.data.diff.x > (window.innerWidth * .25) || this.data.diff.x > DISX) {
        this.fired = true;

        this.emit('left', this.data);
    }

    //Right
    else if (this.data.diff.x < 0 && Math.abs(this.data.diff.x) > (window.innerWidth * .25)) {
        this.fired = true;

        this.emit('right', this.data);
    }

    //Up
    if (this.data.diff.y > (window.innerHeight * .25) || this.data.diff.y > DISY) {
        this.fired = true;

        this.emit('up', this.data);
    }

    //down
    else if (this.data.diff.y < 0 && Math.abs(this.data.diff.y) > (window.innerHeight * .25)) {
        this.fired = true;

        this.emit('down', this.data);
    }
};

Action.prototype.setDirection = function() {
    //A movement have been made
    if(this.data.diff) {
        if(Math.abs(this.data.diff.x) > Math.abs(this.data.diff.y)) {
            this.data.direction = "horizontal";
        }
        else if(Math.abs(this.data.diff.x) < Math.abs(this.data.diff.y)) {
            this.data.direction = "vertical";
        }
    }
};

Action.prototype.keyHandle = function(event) {

	switch (event.keyCode) {

		case 39:
			this.emit('right');
			break;

		case 37:
			this.emit('left');
			break;

		case 38:
		case 32:
			this.emit('up');
			break;

		case 40:
			this.emit('down');
			break;

	}

};