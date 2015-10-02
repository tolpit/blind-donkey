"use strict";

function GameMap() {
    this.map = null;
	this.originalMap = null;
    this.entities = {
        player: new Player(),
        ladders: [],
        barrels: []
    };
    this.action = new Action();

    this.load();

    this.interval = setInterval(this.loop.bind(this), 1000);
	this.spawnInterval = setInterval(this.spawn.bind(this), 10000);

}

//Load the map
GameMap.prototype.load = function() {
    var self = this;
    var xhr  = new XMLHttpRequest();

    xhr.onload = function() {
        try {
            self.map 		 = JSON.parse(xhr.responseText);
			self.originalMap = JSON.parse(xhr.responseText);

            self.handleEvents();
            self.spawn();
        }
        catch(err) {
            console.error(err);
        }
    };

    xhr.open('GET', '/map.json');
    xhr.send(null);
};

GameMap.prototype.spawn = function() {
	var newBarrel = new Barrel();
		newBarrel.setMap(this.map);
		newBarrel.setOriginal(this.originalMap);


	var length = this.entities.barrels.push(newBarrel);
    this.entities.barrels[length - 1].setDirection(-1);

};

GameMap.prototype.loop = function() {
	console.clear();

	for(var y = 0; y < this.map.length; y++) {
		console.log(this.map[y]);
	}
};

GameMap.prototype.handleEvents = function() {
	var playerPos = this.getPositionOf(2);

	this.entities.player
		.setPosition(playerPos.x, playerPos.y)
		.setMap(this.map);

    this.action.on('left', this.entities.player.moveLeft.bind(this.entities.player));

    this.action.on('right', this.entities.player.moveRight.bind(this.entities.player));

    this.action.on('up', this.entities.player.moveUp.bind(this.entities.player));

    this.action.on('down', this.entities.player.moveDown.bind(this.entities.player));

};

GameMap.prototype.getPositionOf = function(type) {
	var position = {};

	for(var y = 0; y < this.map.length; y++) {
		for(var x = 0; x < this.map[y].length; x++) {
			if(this.map[y][x] == 2) {
				position.x = x;
				position.y = y;
			}
		}
	}

	return position;
};

GameMap.can = function(map, x, y) {
	return (
		(y < (map.length) && y > 0) &&
		(x < (map[0].length) && x > 0 && map[y][x] != 5)
	);
};

GameMap.hit = function(map, x, y) {
	if(map[y][x] == 2) {
		Audio.play("death");

		return true;
	}

	return false;
};

GameMap.win = function(map, x, y) {
	return (map[y][x] == 6);
};

GameMap.canClimb = function(map, x, y) {
	return (map[y][x] == 1) || (map[y - 1][x] == 1) || (map[y + 1][x] == 1);
};


GameMap.prototype.caseType = function(x, y) {

	if(!this.map[y][x]) return null;

	switch(this.map[y][x]) {

		case 0:
			return 'Case';
			break;

		case 1:
			return 'Ladder';
			break;

		case 2:
			return 'Player';
			break;

		case 3:
			return 'Enemy';
			break;

		case 4:
			return 'Barrel';
			break;

	}

};