"use strict";

function Entity(map) {
    this.x = 6;
    this.y = 3;
    this.direction = 0;

    this.map = map;

    setInterval(this.move.bind(this), 1000);
}

Entity.prototype.move = function() {
    var tmpX = this.x + this.direction,
        newX,
        newY;

    //Check if there is a ladder down
    if(this.map[this.y + 1] && this.map[this.y + 1][tmpX] && this.map[this.y + 1][tmpX] == 1) {
        newY = this.y - 1;
        newX = this.x;
    }
    //End to down the ladder
    else if(this.map[this.y + 1] && this.map[this.y + 1][tmpX] && this.map[this.y + 1][tmpX] == 5) {
        this.direction = (this.direction == -1 ? 1 : -1);
        newY = this.y;
        newX = this.x;
    }
    //Basic move
    else if(this.map[this.y] && this.map[this.y][tmpX] && this.map[this.y + 1][this.x] == 5) {
        newY = this.y;
        newX = tmpX;
    }

    if(newX)
        this.x = newX;

    if(newY)
        this.y = newY;

};

Entity.prototype.setDirection = function(dir) {
    this.direction = dir;
};