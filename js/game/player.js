"use strict";

var JUMPTIME = 2000;

function Player() {
	this.height 	= 2;
    this.x 			= null;
    this.y 			= null;
	this.map 		= null;
	this.canClimb 	= false;
}

Player.prototype.move = function(x, y) {
	var self = this;

	return new Promise(function(resolve, reject) {
		var oldX = self.x;
		var oldY = self.y;

		//block the player on the game border
		if(!GameMap.can(self.map, x, y)) return reject();
		if(GameMap.win(self.map, x, y)) return resolve('win');

		//Climb activator
		var oldClimbValue = self.canClimb;

		self.canClimb = GameMap.canClimb(self.map, x, y);

		if(self.canClimb === true && oldClimbValue === false) {
			setTimeout(function() {
				Audio.play("canclimb");
			}, 1000);
		}

		self.x = x;
		self.y = y;

		//reset old pos to 0
		self.map[oldY][oldX] = 0;
		//self.map[oldY - 1][oldX] = 0;

		self.map[self.y][self.x] = 2;
		//self.map[self.y - 1][self.x] = 2;

		return resolve();
	});

};

Player.prototype.moveLeft = function() {
    //console.log('Left');

    this
		.move(this.x - 1, this.y)
		.then(function(win) {
			if(win) {
				Audio.play("complete");
			}
			else {
				Audio.position("left")
					  .play("walking");
			}
		})
		.catch(function() {
			Audio.play("stop");
		});
};

Player.prototype.moveRight = function() {
    //console.log('Right');

    this
		.move(this.x + 1, this.y)
		.then(function(win) {
			if(win) {
				Audio.play("complete");
			}
			else {
				Audio.position("right")
					  .play("walking");
			}
		})
		.catch(function() {
			Audio.play("stop");
		});
};

Player.prototype.moveUp = function() {
	var self = this;

	//climb
    if(this.canClimb) {
		this
			.move(this.x, this.y - 1)
			.then(function() {
				Audio
					.speed(.85)
					.play("walking");
			})
			.catch(function() {
				Audio
					.speed(.75)
					.play("walking");
			});
	}
	//or jump
	else {
		this
			.move(this.x, this.y - 1)
			.then(function() {
				//Jump over the barrel !
				if(self.map[self.y + 1][self.x] == 8 || self.map[self.y + 1][self.x + 1] == 8 || self.map[self.y + 1][self.x - 1] == 8) {
					Audio.play("jumpover");
				}
				//Basic jump
				else {
					Audio.play("jump");
				}

				setTimeout(function() {
					self.move(self.x, self.y + 1);
				}, JUMPTIME);
			})
			.catch(function(err) {
				console.log(err);
				Audio.play("stop");
			});
	}
};

Player.prototype.moveDown = function() {
    if(this.y <= 13) return;

    //console.log('Down');

    this.move(this.x, this.y - 1);
};

Player.prototype.setPosition = function(x, y) {
	this.x = x;
	this.y = y;

	return this;
};

Player.prototype.setMap = function(map) {
	this.map = map;

	return this;
};