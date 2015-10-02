"use strict";

function GameMap() {
    this.map = null;
    this.entities = {
        player: null,
        ladders: []
    };
    this.action = new Action();

    this.load();

    setInterval(this.loop.bind(this), 1000);
}

GameMap.prototype.load = function() {
    var self = this;
    var xhr  = new XMLHttpRequest();

    xhr.onload = function() {
        try {
            self.map = JSON.parse(xhr.responseText);
            self.parse();
            self.applyEvents();
        }
        catch(err) {
            console.error(err);
        }
    };

    xhr.open('GET', '/map.json');
    xhr.send(null);
};

GameMap.prototype.parse = function() {
    var self = this;

    for(var y = 0; y < this.map.length; y++) {

        for(var x = 0; x < this.map[y].length; x++) {

            if(this.caseType(x, y) == 'Player' && !this.entities.player) {
                this.entities.player = new Player();
            }

        }

    }

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

GameMap.prototype.loop = function() {
    //console.log(this.map);
};

GameMap.prototype.check = function() {
    //console.log(this.map);
    for(var y = 0; y < this.map.length; y++) {

        for(var x = 0; x < this.map[y].length; x++) {

            if(this.caseType(x, y) == 'Player' && !this.entities.player) {
                this.entities.player = new Player();
            }

        }

    }

};

GameMap.prototype.applyEvents = function() {
    var self = this;

    this.action.on('left', function() {
        self.entities.player.moveLeft();
        self.check();
    });

    this.action.on('right', function() {
        self.entities.player.moveRight();
        self.check();
    });

    this.action.on('up', function() {
        self.entities.player.moveUp();
        self.check();
    });

    this.action.on('down', function() {
        self.entities.player.moveDown();
        self.check();
    });

};