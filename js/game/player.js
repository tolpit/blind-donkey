"use strict";

function Player() {
    this.x = 1; //TODO: x,y from the map.json
    this.y = 13; //TODO: x,y from the map.json
    this.height = 2; //TODO: height from the map.json

    console.log(this);
}

Player.prototype.move = function(x, y) {
    this.x = x;
    this.y = y;
};

Player.prototype.moveFrom = function(xDiff, yDiff) {
    this.move(
        this.x + xDiff,
        this.y + yDiff
    );
};