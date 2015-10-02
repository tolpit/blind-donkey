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

    console.log(this);
};

Player.prototype.moveFrom = function(xDiff, yDiff) {
    this.move(
        this.x + xDiff,
        this.y + yDiff
    );
};

Player.prototype.moveLeft = function(xDiff, yDiff) {
    console.log('Left');

    this.move(
        this.x - 1,
        this.y
    );

    Audio.play("walking", "left");
};

Player.prototype.moveRight = function(xDiff, yDiff) {
    console.log('Right');

    this.move(
        this.x + 1,
        this.y
    );

    Audio.play("walking", "right");
};

Player.prototype.moveUp = function(xDiff, yDiff) {
    console.log('Jump');

    this.move(
        this.x,
        this.y + 1
    );

    Audio.play("jump");
};

Player.prototype.moveDown = function(xDiff, yDiff) {
    if(this.y <= 13) return;

    console.log('Down');

    this.move(
        this.x,
        this.y - 1
    );
};