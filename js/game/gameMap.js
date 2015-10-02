"use strict";

function GameMap() {
    this.map = null;

    this.load();
}

GameMap.prototype.load = function() {
    var self = this;
    var xhr  = new XMLHttpRequest();

    xhr.onload = function() {
        try {
            self.map = JSON.parse(xhr.responseText);
            console.log(self);
        }
        catch(err) {
            console.error(err);
        }
    };

    xhr.withCredentials = true;

    xhr.open('GET', '/map.json');
    xhr.send(null);
};