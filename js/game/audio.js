"use strict";

function Audio() {
    this.assets = {};
}

Audio.prototype.load = function() {
    var self = this;
    var xhr  = new XMLHttpRequest();

    xhr.onload = function() {
        try {
            self.assets = JSON.parse(xhr.responseText);
        }
        catch(err) {
            console.error(err);
        }
    };

    xhr.open('GET', '/audio.json');
    xhr.send(null);
};