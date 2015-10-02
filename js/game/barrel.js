"use strict";

function Barrel() {
    this.x = 6;
    this.y = 2;
    this.direction = 0;

    this.map;
	this.original;

    this.interval = setInterval(this.move.bind(this), 15000);
}

Barrel.prototype.move = function() {
	var tmpX = this.x + this.direction,
        newX,
        newY;

    //Basic move
    if(this.map[this.y + 1][this.x] == 5) {
        newY = this.y;
        newX = tmpX;
    }
	//Check if there is a ladder down
	else if(this.map[this.y + 1][this.x] == 1) {
		newY = this.y + 1;
		newX = this.x;

		//End to down the ladder: switch direction orientation
		if(this.map[newY + 1][this.x] == 5) {
			this.direction = (this.direction == -1 ? 1 : -1);
		}
	}

	this.map[this.y][this.x] = this.original[this.y][this.x]; //reset

	if(!GameMap.can(this.map, newX, newY)) return;
	if(GameMap.hit(this.map, newX, newY))  return clearInterval(this.interval);

    if(newX) this.x = newX;
    if(newY) this.y = newY;

	this.map[this.y][this.x] = 8;
};

Barrel.prototype.setDirection = function(dir) {
    this.direction = dir;
};

Barrel.prototype.setMap = function(map) {
	this.map = map;
};

Barrel.prototype.setOriginal = function(original) {
	this.original = original;
};